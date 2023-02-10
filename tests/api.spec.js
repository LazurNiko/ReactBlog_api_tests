const { test } = require('@playwright/test');
const { request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
let response;
let ApiUtils;

test.beforeEach(async() => {
  const requestContext = await request.newContext();
  ApiUtils = new APIUtils(requestContext);
})

test("Create account - POST request", async() => {
  response = await ApiUtils.createAccount();
})

test("Login - POST request", async() => {
  await ApiUtils.login();
})

test.only('Article should be visible - GET request', async () => {
  await ApiUtils.getArticle();
})

test('Authenticated user should be able to comment an article - POST request', async () => {
  await ApiUtils.commentArticle();
})

test('Authenticated user should be able to upvote an article - PUT request', async () => {
  await ApiUtils.upvoteArticle();
})

