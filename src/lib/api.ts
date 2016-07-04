import User from '../models/user'

const Octokat = require('octokat')

/**
 * Information about a repository as returned by the GitHub API.
 */
export interface Repo {
  cloneUrl: string,
  htmlUrl: string,
  name: string
  owner: {
    avatarUrl: string,
    login: string
    type: 'user' | 'org'
  },
  private: boolean,
  fork: boolean,
  stargazersCount: number
}

/**
 * An object for making authenticated requests to the GitHub API
 */
export default class API {
  private client: any

  public constructor(user: User) {
    this.client = new Octokat({token: user.getToken(), rootURL: user.getEndpoint()})
  }

  /**
   * Loads all repositories accessible to the current user.
   *
   * Loads public and private repositories across all organizations
   * as well as the user account.
   *
   * @returns A promise yielding an array of {Repo} instances or error
   */
  public async fetchRepos(): Promise<Repo[]> {
    const results: Repo[] = []
    let nextPage = this.client.user.repos
    while (nextPage) {
      const request = await nextPage.fetch()
      results.push(...request.items)
      nextPage = request.nextPage
    }

    return results
  }
}
