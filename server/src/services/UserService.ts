import { Service } from "typedi";
import { UserRepository } from "../repositories/UserRepository";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Users } from "../models/Users";
import {
  encryptPassword,
  checkPassword,
  checkIsSnsLogin
} from "../util/authUtils";
import { UserDTO } from "../dto/UserDTO";

@Service()
export class UserService {
  constructor(
    @InjectRepository() private readonly userRepository: UserRepository
  ) {}

  /** GET */
  public find() {
    return this.userRepository.find();
  }

  public async findOne(loginId: string) {
    const result = await this.userRepository.findOne(loginId);
    if (result !== undefined) {
      const userResponse = new UserDTO(
        result,
        true,
        checkIsSnsLogin(result.refreshToken)
      );
      return userResponse;
    }
    return result;
  }

  public async findOnebyIdx(id: number) {
    const result = await this.userRepository.findOnebyIdx(id);
    if (result !== undefined) {
      const userResponse = new UserDTO(
        result,
        true,
        checkIsSnsLogin(result.refreshToken)
      );
      return userResponse;
    }
    return result;
  }

  public async findOneByToken(accessToken: string) {
    const result = await this.userRepository.findOneByToken(accessToken);
    if (result !== undefined) {
      const userResponse = new UserDTO(
        result,
        true,
        checkIsSnsLogin(result.refreshToken)
      );
      return userResponse;
    }
    return result;
  }

  /** POST */
  public async create(
    loginId: string,
    password: string,
    name: string,
    email: string,
    accessToken: string,
    refreshToken: string
  ) {
    const { salt, result } = encryptPassword(password);
    const user = new Users();
    user.loginId = loginId;
    user.salt = salt;
    user.password = result;
    user.name = name;
    user.email = email;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const res = await this.userRepository.save(user);
    const userResponse = new UserDTO(res, true, false);

    return userResponse;
  }

  public async update(
    id: number,
    loginId: string,
    password: string,
    name: string,
    email: string
  ) {
    const user = await this.userRepository.findOnebyIdx(id);
    if (user === undefined) return false;
    const { salt, result } = encryptPassword(password);
    user.loginId = loginId;
    user.password = result;
    user.salt = salt;
    user.name = name;
    user.email = email;

    const res = await this.userRepository.save(user);
    const userResponse = new UserDTO(res, true, false);

    return userResponse;
  }

  public async createAuth(
    loginId: string,
    password: string,
    name: string,
    email: string,
    profileUrl: string,
    accessToken: string,
    refreshToken: string
  ) {
    const user = new Users();
    const { salt, result } = encryptPassword(password);
    user.loginId = loginId;
    user.salt = salt;
    user.password = result;
    user.name = name;
    user.email = email;
    user.profileUrl = profileUrl;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const res = await this.userRepository.save(user);
    const userResponse = new UserDTO(res, true, true);

    return userResponse;
  }

  public async checkDuplicate(loginId: string) {
    const result = await this.userRepository.findOne(loginId);
    if (result === undefined) {
      return false;
    }
    return true;
  }

  /** PUT, PATCH */
  public async updateToken(
    loginId: string,
    accessToken: string,
    refreshToken: string
  ) {
    /**TODO: 해당 id값으로 Entitiy를 조회해서, 새로운 user 엔티티로 변경 */
    const user = await this.userRepository.findOne(loginId);
    if (user === undefined) {
      return false;
    }
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    const result = await this.userRepository.save(user);
    const userResponse = new UserDTO(result, true, false);

    return userResponse;
  }

  public async updateUserProfile(id: number, profile: string) {
    const user = await this.userRepository.findOnebyIdx(id);
    if (user === undefined) {
      return false;
    }
    user.profileUrl = profile;
    const result = await this.userRepository.save(user);
    const userResponse = new UserDTO(result, true, false);

    return userResponse;
  }

  public async updateAuth(
    loginId: string,
    name: string,
    email: string,
    profileUrl: string,
    accessToken: string,
    refreshToken: string
  ) {
    const user = await this.userRepository.findOne(loginId);
    if (user === undefined) {
      return false;
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.name = name;
      user.email = email;
      user.profileUrl = profileUrl;
      const result = await this.userRepository.save(user);
      const userResponse = new UserDTO(result, true, true);

      return userResponse;
    }
  }

  /** DELETE */
  public delete(id: number) {
    /**TODO: 해당 id값으로 Enitity 삭제 */
  }

  public async checkLogin(loginId: string, password: string) {
    const user = await this.userRepository.findOne(loginId);
    if (user === undefined) return { msg: false, result: new Users() };
    const result = checkPassword(password, user.password, user.salt);
    return result === true ? { msg: true } : { msg: false };
  }
}
