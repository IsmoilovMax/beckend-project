import {
  MemberInput,
  Member,
  LoginInput,
  MemberUpdateInput,
} from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /**SPA */
  public async getHomeData(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .lean()
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NICK_NOT_FOUND);

    return result;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON() as Member;
    } catch (err) {
      console.log("ERROR, model: signup:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }
      )
      .exec();

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NICK_NOT_FOUND);
    } else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORISED, Message.NOT_AUTHENTICATED);

    return await this.memberModel.findById(member._id).lean().exec();
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: memberId }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })
      .sort({ memberPoints: "desc" })
      .limit(4)
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NICK_NOT_FOUND);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    return await this.memberModel
      .findByIdAndUpdate(
        {
          _id: memberId,
          memberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
        },
        { $inc: { memberPoints: point } },
        { new: true }
      )
      .exec();
  }

  /**SSR  */

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.ADMIN })
      .lean()
      .exec();

    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    console.log("input.memberPassword(before):", input.memberPassword);

    const salt = await bcrypt.genSalt();

    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    console.log("input.memberPassword(after):", input.memberPassword);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";

      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NICK_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORISED, Message.WRONG_PASSWORD);
    }

    const result = await this.memberModel.findById(member._id).exec();
    return result;
  }
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as [];
  }

  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result as Member;
  }
}

export default MemberService;
