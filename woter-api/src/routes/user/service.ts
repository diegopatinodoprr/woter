import type { IAddUserFavoriteCitiesRequest, IUpdateUserInfoRequest, IUser } from '@diegopatinodoprr/woter-library';

const users = new Map<string, IUser>();

export class UserRouteService {
  updateInfo(payload: IUpdateUserInfoRequest): IUser {
    const user = this.getOrCreateUser(payload.userId);

    if (payload.email) {
      user.email = payload.email;
    }

    if (payload.name !== undefined) {
      user.name = payload.name;
    }

    user.updatedAt = new Date().toISOString();
    users.set(user.id, user);

    return user;
  }

  addFavoriteCities(payload: IAddUserFavoriteCitiesRequest): IUser {
    const user = this.getOrCreateUser(payload.userId);
    const normalizedCities = payload.cities.map((city) => city.trim()).filter(Boolean);
    const currentCities = user.favoriteCities ?? [];

    user.favoriteCities = Array.from(new Set([...currentCities, ...normalizedCities]));
    user.updatedAt = new Date().toISOString();
    users.set(user.id, user);

    return user;
  }

  private getOrCreateUser(userId: string): IUser {
    const existingUser = users.get(userId);
    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();
    const createdUser: IUser = {
      id: userId,
      email: `${userId}@example.com`,
      role: 'user',
      favoriteCities: [],
      createdAt: now,
      updatedAt: now,
    };

    users.set(userId, createdUser);
    return createdUser;
  }
}
