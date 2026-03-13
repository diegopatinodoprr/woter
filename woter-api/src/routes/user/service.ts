import type { interfaces, services } from "@diegopatinodoprr/woter-library";
import { BddRouteService } from "../bdd/service";
import type { UserDomainAdapter } from "./domain-adapter";

export class UserRouteService {
  constructor(
    private readonly adapter: UserDomainAdapter,
    private readonly bddService = new BddRouteService()
  ) {}

  async updateInfo(payload: services.IUpdateUserInfoRequest): Promise<interfaces.IUser> {
    const user = await this.getOrCreateUser(payload.userId);

    if (payload.email) {
      user.email = payload.email;
    }

    if (payload.name !== undefined) {
      user.name = payload.name;
    }

    user.updatedAt = new Date().toISOString();
    await this.bddService.updateObject(this.adapter.toUpdateUserRequest(user.id, user));

    return user;
  }

  async addFavoriteCities(payload: services.IAddUserFavoriteCitiesRequest): Promise<interfaces.IUser> {
    const user = await this.getOrCreateUser(payload.userId);
    const normalizedCities = payload.cities.map((city) => city.trim()).filter(Boolean);
    const currentCities = user.favoriteCities ?? [];

    user.favoriteCities = Array.from(new Set([...currentCities, ...normalizedCities]));
    user.updatedAt = new Date().toISOString();
    await this.bddService.updateObject(this.adapter.toUpdateUserRequest(user.id, user));

    return user;
  }

  private async getOrCreateUser(userId: string): Promise<interfaces.IUser> {
    const existingUser = await this.findUserById(userId);
    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();
    const createdUser: interfaces.IUser = {
      id: userId,
      email: `${userId}@example.com`,
      role: "user",
      favoriteCities: [],
      createdAt: now,
      updatedAt: now,
    };

    await this.bddService.createObject(this.adapter.toCreateUserRequest(createdUser));
    return createdUser;
  }

  private async findUserById(userId: string): Promise<interfaces.IUser | null> {
    const response = await this.bddService.searchObject(this.adapter.toSearchUserRequest(userId));
    return this.adapter.toUserFromSearchResponse(response);
  }
}
