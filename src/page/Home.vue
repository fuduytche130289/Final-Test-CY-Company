<template>
  <div class="container mx-auto w-7/12">
    <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div class="relative flex items-center space-x-4">
          <div class="relative">
            <span class="absolute text-green-500 right-0 bottom-0">
               <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
               </svg>
            </span>
            <img
                src="../assets/logo.png"
                alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
          </div>
          <div class="flex flex-col leading-tight">
            <div class="text-2xl mt-1 flex items-center">
              <span class="text-gray-700 mr-3">Nhóm chat CY-VN</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button type="button"
                  class="py-1 px-4 bg-teal-500 hover:bg-teal-700 rounded-lg text-white" @click="logout">
            Đăng xuất
          </button>
        </div>
      </div>
      <div class="overflow-y-scroll" ref="listChat">
        <div id="messages"
             class="flex flex-col space-y-4 p-3"
             v-for="(item,index) in dataMessage.sort((a,b)=>a.date - b.date)" :key="index">
          <div class="chat-message" v-if="user.uid != item.uid">
            <div class="flex items-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>{{ item.name }}</div>
                <div v-if="item.message != ''"><span
                    class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{{
                    item.message
                  }}</span>
                </div>
                <div v-if="item.urls.length > 0">
                  <img class="w-40 h-40 object-cover overflow-hidden" :src="item.urls[0]" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="chat-message" v-if="user.uid == item.uid">
            <div class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div>{{ item.name }}</div>
                <div v-if="item.message != ''">
                  <span
                      class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-teal-600 text-white ">{{
                      item.message
                    }}
                  </span>
                </div>
                <div v-if="item.urls.length > 0">
                  <img class="w-40 h-40 object-cover overflow-hidden" :src="item.urls[0]" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="preFiles.length > 0">
        <div class="w-40 h-40 relative" v-for="(img,index) in preFiles" :key="index">
          <img class="w-40 h-40 object-cover shadow" type="img" :src="img"/>
          <i class="w-6 h-6 absolute z-10 top-2 left-32 rounded-full text-center flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-gray-200 bg-gray-300 text-2xl"
             @click="removeSelectedImage(index)"><i class="fa-solid fa-xmark"></i></i>
        </div>
      </div>
      <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div class="relative flex">
         <span class="absolute inset-y-0 flex items-center">
            <button type="button"
                    class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
               </svg>
            </button>
         </span>
          <input type="text" placeholder="Write your message!" v-model="message"
                 @keydown.enter.exact.prevent="sendMessage"
                 class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
          <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <label for="image" class="cursor-pointer text-gray-500 pr-4">
              <i class="fa-solid fa-image"></i>
              <input type="file" id="image" class="hidden" access="image/*" @change="imageChange($event)" multiple>
            </label>
            <button type="button" @click="sendMessage"
                    class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-teal-500 hover:bg-teal-700 focus:outline-none">
              <span class="font-bold">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                   class="h-6 w-6 ml-2 transform rotate-90">
                <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getAuth, signOut} from "firebase/auth";
import {auth, db} from "../firebase";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, onSnapshot} from "firebase/firestore";

export default {
  name: "Login",
  data() {
    return {
      message: [],
      selectedImage: [],
      files: [],
      preFiles: [],
      user: null,
      dataMessage: [],
    };
  },
  methods: {
    async sendMessage() {
      const storage = getStorage();//base storage //unix
      if (!this.message && this.preFiles.length == 0) {
        console.log(this.preFiles.length)
        return;
      }
      const urls = []
      if (this.files.length > 0) {
        const fileName = `images/${Date.now()}image.png`;
        const myRef = ref(storage, fileName);//tao ref
        await uploadBytes(myRef, this.files[0], fileName);
        const pathRef = ref(storage, fileName);
        const url = await getDownloadURL(pathRef);
        console.log(url);
        urls.push(url);
      }
      const collectionRef = collection(db, 'chats');
      await addDoc(collectionRef, {
        message: this.message,
        uid: this.user.uid,
        date: new Date(),
        urls: urls,
        name: this.user.email,
      });
      this.message = '';
      this.files = [];
      this.preFiles = [];
    },
    imageChange(e) {
      if (e.target.files) {
        this.files = e.target.files;
        console.log("this.files", this.files)
        this.preFiles = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        console.log("this.preFiles", this.preFiles)
      }
    },
    async getMessage() {
      let unSub = null;
      const collectionRef = collection(db, 'chats');
      // const collectionQuery = query(collectionRef, where('userUid', 'in', [[userId, user.uid], [user.uid, userId]]));
      unSub = onSnapshot(collectionRef, (snapShot) => {
        let localMessage = [];
        console.log("localMessage", localMessage)
        snapShot.forEach(doc => {
          localMessage.push({
            id: doc.id,
            message: doc.data().message,
            uid: doc.data().uid,
            date: doc.data().date,
            urls: doc.data().urls,
            name: doc.data().name,
          });
        });
        this.dataMessage = localMessage;
      });
      console.log("dataMessage", this.dataMessage)
    },
    removeSelectedImage(index) {
      const postFile = [...this.files];
      postFile.splice(index, 1)
      this.preFiles.splice(index, 1);
      this.files = postFile;
      console.log(this.files)

    },
    logout() {
      console.log(auth)
      signOut(auth).then(() => {
        // Sign-out successful.
        sessionStorage.removeItem('user');
        this.$router.replace('/')
        alert("Đăng xuất thành công")
      }).catch((error) => {
        console.log(error)
      });
    },
    checkLogin() {
      if (this.user == null) {
        alert("Bạn cần đăng nhập để vào trang này!")
        this.$router.replace("/")
      }
    },
    scrollToEnd() {
      let content = this.$refs.listChat;
      content.scrollTop = content.scrollHeight
    },

  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem("user"))
    console.log('asdasdas', this.user);
    this.checkLogin();
    this.getMessage();
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },


}
</script>

<style>

</style>
