import axios from "axios"
import qs from "qs"

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params)
}

const prefix = "/api/v1/"

async function requestNewclub(categoryId, clubName, description) {
  return await axios.post(prefix + "request-newclub", { categoryId, clubName, description })
}
async function acceptNewclub(newClubRequestId) {
  return await axios.post(prefix + "accept-newclub", { newClubRequestId })
}
async function denyNewclub(newClubRequestId) {
  return await axios.post(prefix + "deny-newclub", { newClubRequestId })
}
async function updateClubProfile(clubName, clubProfile) {
  return await axios.post(prefix + "club-profile/" + clubName, { clubProfile })
}
async function deleteClub(clubName) {
  return await axios.post(prefix + "club-profile/" + clubName)
}
async function requestHandover(clubName, userId) {
  return await axios.post(prefix + "request-handover" + clubName, { userId })
}
async function acceptHandover(requestHandoverId) {
  return await axios.post(prefix + "accept-handover/" + requestHandoverId)
}
async function denyHandover(requestHandoverId) {
  return await axios.post(prefix + "deny-handover/" + requestHandoverId)
}
async function requestJoin(clubName) {
  return await axios.post(prefix + "request-join/" + clubName)
}
async function acceptJoin(clubName, userId) {
  return await axios.post(prefix + "accept-join/" + clubName, { userId })
}
async function denyJoin(clubName, userId) {
  return await axios.post(prefix + "deny-join/" + clubName, { userId })
}
async function getOuttaMyClubDude(clubName, userId) {
  return await axios.post(prefix + "get-outta-my-club-dude/" + clubName, { userId })
}
async function createPost(clubName, postInfo, files) {
  const res = await axios.post(prefix + "create-post", { clubName, postInfo })
  console.log(res)
  const postId = res.data.postId

  const formData = new FormData()
  formData.append("clubName", clubName)
  formData.append("postId", postId)
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    formData.append("uploadImages", file)
  }
  return await axios.post(prefix + "send-files-for-post/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
async function updatePost(clubName, postId, postInfo) {
  return await axios.post(prefix + "update-post/" + clubName + "/" + postId, { postInfo })
}
async function deletePost(clubName, postId) {
  return await axios.post(prefix + "delete-post." + clubName + "/" + postId)
}
async function sendAuthCode(userId, purpose) {
  return await axios.post(prefix + "send-auth-code", { userId, purpose })
}
async function checkAuthCode(userId, code) {
  return await axios.post(prefix + "check-auth-code", { userId, code })
}
async function signUp(userId, code, password, phone) {
  return await axios.post(prefix + "sign-up", { userId, code, password, phone })
}
async function signIn(userId, password) {
  return await axios.post(prefix + "sign-in", { userId, password })
}
async function signOut() {
  return await axios.post(prefix + "sign-out")
}
async function getUserInfo() {
  return await axios.get(prefix + "get-user-info")
}
async function updateUserPhone(phone) {
  return await axios.post(prefix + "update-user-phone", { phone })
}
async function updateUserPassword(oldPw, newPw) {
  return await axios.post(prefix + "update-user-password", { oldPw, newPw })
}
async function resetPassword(userId, password) {
  return await axios.post(prefix + "reset-password", { userId, password })
}
async function createSubscription(clubName) {
  return await axios.post(prefix + "create-subscription/" + clubName)
}
async function deleteSubscription(clubName) {
  return await axios.post(prefix + "delete-subscription/" + clubName)
}
async function getAdminInfo() {
  return await axios.post(prefix + "get-admin-info")
}
async function retrieve(params) {
  return await axios.get(prefix + "retrieve", { params })
}

export default {
  retrieve,
  requestNewclub,
  acceptNewclub,
  denyNewclub,
  updateClubProfile,
  deleteClub,
  requestHandover,
  acceptHandover,
  denyHandover,
  requestJoin,
  acceptJoin,
  denyJoin,
  getOuttaMyClubDude,
  createPost,
  updatePost,
  deletePost,
  sendAuthCode,
  checkAuthCode,
  signUp,
  signIn,
  signOut,
  getUserInfo,
  updateUserPhone,
  updateUserPassword,
  resetPassword,
  createSubscription,
  deleteSubscription,
  getAdminInfo,
}
