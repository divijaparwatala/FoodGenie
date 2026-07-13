import api from "../../utils/api";

import {
    userRequest,
    userSuccess,
    userFail,
    logoutSuccess,
    logoutFail,
    updateRequest,
    updateSuccess,
    updateFail,
    updateReset,
    clearErrors
} from "../slices/userSlice";
//login
export const login = (email, password) => async(dispatch) => {
        try {
            dispatch(userRequest());
            const { data } = await api.post("v1/users/login", { email, password });
            dispatch(userSuccess(data.data.user));
        } catch (error) {
            dispatch(userFail(error.response?.data?.message || "Login Failed"));
        }
    }
    //signup/register
export const register = (userData) => async(dispatch) => {
        try {
            dispatch(userRequest());
            const { data } = await api.post("v1/users/signup", userData, {
                headers: { "Content-Type": "application/json" }
            });
            dispatch(userSuccess(data.data.user));
        } catch (error) {
            dispatch(userFail(error.response?.data?.message || "Registration failed"));
        }
    }
    //load user
export const loadUser = () => async(dispatch) => {
        try {
            dispatch(userRequest());
            const { data } = await api.get("v1/users/me");
            dispatch(userSuccess(data.user));
        } catch (error) {
            dispatch(userFail(error.response?.data?.message ));
        }
    }
    //update profile
export const updateProfile = (userData) => async(dispatch) => {
        try {
            dispatch(updateRequest());
            const { data } = await api.put("v1/users/me/update", userData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            dispatch(updateSuccess(true));
            dispatch(userSuccess(data.data.user));
        } catch (error) {
            dispatch(updateFail(error.response?.data?.message || "Update failed"));
        }
    }
    //logout
export const logout = () => async(dispatch) => {
    try {
        await api.get("v1/users/logout");
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail(error.response?.data?.message || "Logout failed"));
    }
}