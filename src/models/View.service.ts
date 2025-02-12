import ViewModel from "../schema/View.model";
import { View, ViewInput } from "../libs/types/view";
import Errors, { HttpCode, Message}  from "../libs/utils/Errors";


class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View> {
    return await this.viewModel
      .findOne({ memberId: input.memberId, viewRefid: input.viewRefId })
      .exec() as any;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try{
        return await this.viewModel.create(input) as any;
    } catch(err) {
        console.log("ERROR, model.insertMemberView", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
    }
  }
}

export default ViewService;
