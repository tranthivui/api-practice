import { test, expect, request } from '@playwright/test';

test('Get 1 bai viet', async ({ request }) => {
  const response = await request.get("/posts/1");
  expect(response.status()).toBe(200);
});

test("Get 1 bai viet - co type", async ({ request }) => {
  const response = await request.get("/posts/1");
  expect(response).toBeOK();

  const post: Post = await response.json();
  expect(post.id).toBe(1);
  expect(post.title.length).toBeGreaterThan(0);
  console.log(post.title);
});

test("Get list bai viet", async ({ request }) => {
  const response = await request.get("/posts");
  expect(response).toBeOK();

  const listPost: Post[] = await response.json();
  expect(listPost.length).toBeGreaterThan(0);
  console.log(listPost.length);
});

test("Get bai viet theo userId", async ({ request }) => {
  const res = await request.get("/posts", { params: { userId: 1 } });
  const listPost: Post[] = await res.json();
  expect(res).toBeOK();
  expect(listPost.length).toBeGreaterThan(0);
  console.log(listPost.length);
});

test("Create new post", async ({ request }) => {
  const newPost = { userId: 1, title: "Hello", body: "Xin chao" };
  const created = await request.post("/posts", {
    data: newPost,
    headers: { "Content-Type": "application/json" },
  });
  expect(created.status()).toBe(201);
});

test("So sanh moi phan tu trong danh sach",async({request})=>{
  const response=await request.get("/posts",{params: {userId:1}});
  expect(response).toBeOK();
  const listPost: Post[]=await response.json();
  expect(listPost.length).toBeGreaterThan(0);
  for(const post of listPost){
    expect(post.userId).toBe(1);
  };
});

test("ID khong ton tai",async({request})=>{
  const response = await request.get("/posts/999999");
 //   expect(response.status()).toBe(404);
});

test("Gia lap",async({page})=>{
  const fakePost={userId: 1, title: "Hello", body: "Xin chao" };
  await page.route("**/posts",async route =>{
    await route.fulfill({status: 404, json: fakePost});
  });
  await page.goto("/");
})