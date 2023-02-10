const { expect } = require('@playwright/test');


export class APIUtils {
  constructor(requestContext) {
    this.requestContext = requestContext;
  }

  async createAccount() {
    let response = {}
    const loginResponse = await this.requestContext.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`, 
      {
        form: {
          email: "user" + `${Math.round(Math.random() * 100000)}` + "@mail.com",
          password: "12345Qwerty",
          returnSecureToken: true
        }
      }
  );
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    console.log(loginResponseJson)
    let token = loginResponseJson.idToken;
    let email = loginResponseJson.email;
    response.idToken = token;
    response.email = email;
    console.log(response)
    return response;
  }

  async login() {
    let response = await this.createAccount();
    const loginResponse = await this.requestContext.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`, 
      {
        form: {
          email: response.email,
          password: "12345Qwerty",
          returnSecureToken: true
        }
      }
    );
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json()
    expect(await loginResponseJson.email).toBe(`${response.email}`);
  }

  async getArticle() {
    let response = await this.createAccount();
    const responseArticle = await this.requestContext.get(
      'https://reactblog-34a5a.lm.r.appspot.com/api/articles/Machu-Picchu',
      {
        headers: {
          'authtoken': response.idToken
        }
      },
    )
    expect(responseArticle.headersArray('_id', 'name', 'upvotes', 'comments')).toBeTruthy();
    console.log(await responseArticle.json());
    expect(responseArticle.status()).toBe(200);
  }

  async commentArticle() {
    let response = await this.createAccount();
    const randomText = "This should have" + `${Math.round(Math.random() * 100000)}` + "likes";
    const responseComment = await this.requestContext.post(
      'https://reactblog-34a5a.lm.r.appspot.com/api/articles/Machu-Picchu/comments',
      {
        data: {"postedBy":"","text":randomText},
        headers: {
          'authtoken': response.idToken
        }
      },
    )
    expect(responseComment.ok()).toBeTruthy();
    expect(await responseComment.headersArray('postedBy', 'text')).toBeTruthy();
    console.log(await responseComment.json());
  }

  async upvoteArticle() {
    let response = await this.createAccount();
    
    const responseUpvote = await this.requestContext.put(
      'https://reactblog-34a5a.lm.r.appspot.com/api/articles/Machu-Picchu/upvote',
      {
        headers: {
          'authtoken': response.idToken
        }
      }
    )
    expect(responseUpvote.status()).toBe(200);
    const responseUpvoteJson = await responseUpvote.json()
    console.log(responseUpvoteJson);
  }
}
