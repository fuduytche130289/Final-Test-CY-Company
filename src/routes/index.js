import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);
export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../page/LoginPage')
        },
        {
            path: '/dang-ky',
            name: 'signup',
            component: () => import('../page/SignUp')
        },

    ],
    mode: "history"
})