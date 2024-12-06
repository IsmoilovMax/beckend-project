import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";

const memberService = new MemberService();
const adminController: T = {};

adminController.goHome = async (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error, GoHome:", err);
    res.redirect("/admin");
  }
};

adminController.getSignup = async (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("ERROR, getSignup:", err);
    res.redirect("/admin");
  }
};

adminController.getLogin = async (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("ERROR, getLogin:", err);
    res.redirect("/admin");
  }
};

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;
    console.log("File:", file);
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.ADMIN;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, ProcessSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert('${message}'); window.location.replace("/admin/signup")</script>`
    );
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
    // res.send("processLogin");
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert('${message}'); window.location.replace("/admin/login")</script>`
    );
  }
};

adminController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("ERROR, logout:", err);
    res.redirect("/admin");
  }
};

adminController.getUser = async (req: Request, res: Response) => {
  try {
    console.log("getUser");
    const result = await memberService.getUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("ERROR, getUser:", err);
  }
};

adminController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("ERROR, updateChosenUser:", err);
  }
};

adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) {
      res.send(`<script> alert("${req.session.member.memberNick}")</script> `);
    } else {
      res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
    }
  } catch (err) {
    console.log("ERROR, checkAuthSession:", err);
    res.send(err);
  }
};

adminController.verifyMember = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.ADMIN) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script>alert('${message}'); window.location.replace('/admin/login')</script>`
    );
  }
};

export default adminController;
