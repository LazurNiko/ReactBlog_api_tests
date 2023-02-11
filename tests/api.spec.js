const { test } = require('@playwright/test');
const { request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
let response;
let ApiUtils;

test.beforeEach(async() => {
  const requestContext = await request.newContext();
  ApiUtils = new APIUtils(requestContext);
})

test("@API Create account - POST request", async() => {
  response = await ApiUtils.createAccount();
})

test("@API Login - POST request", async() => {
  await ApiUtils.login();
})

test('@API Article should be visible - GET request', async () => {
  await ApiUtils.getArticle();
})

test('@API Authenticated user should be able to comment an article - POST request', async () => {
  await ApiUtils.commentArticle();
})

test('@API Authenticated user should be able to upvote an article - PUT request', async () => {
  await ApiUtils.upvoteArticle();
})

