import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userRegistration } from "./authSlice";

type RegistrationResponse = {
    message: string;
    activationToken: string;
};

type RegistrationData = {
    name: string;
    email: string;
    password: string;
};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "registration",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data?.activationToken,
                        })
                    );
                } catch (error) {
                    console.error("Error during registration:", error);
                }
            },
        }),
        activationUser: builder.mutation({
            query:({activation_token, activation_code}) =>({
                url: "activate-user",
                method: "POST",
                body:{
                    activation_token, activation_code
                }
            })
        }),
        loginUser: builder.mutation({
            query:({email,password})=>({
                url: "login",
                method: "POST",
                body:{
                    email, password
                },
                credentials: "include"
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data?.accessToken,
                            user: result.data?.user,
                        })
                    );
                } catch (error) {
                    console.error("Error during registration:", error);
                }
            },
        }),
        socialAuth: builder.mutation({
            query:({email,name, avatar})=>({
                url: "social-auth",
                method: "POST",
                body:{
                    email, name, avatar
                },
                credentials: "include"
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data?.accessToken,
                            user: result.data?.user,
                        })
                    );
                } catch (error) {
                    console.error("Error during registration:", error);
                }
            },
        }),
    }),
});

export const {useRegisterUserMutation,useActivationUserMutation,useLoginUserMutation,useSocialAuthMutation} = authApi
