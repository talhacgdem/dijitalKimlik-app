import api from '../api';
import {LoginRequestDTO, LoginResponseDTO} from '@/dto/Auth';
import {authLogin} from "@/constants/Endpoints";

export const login = async (email: string, password: string): Promise<LoginResponseDTO> => {
    let requestData: LoginRequestDTO = {
        email: email,
        password: password
    };
    const response = await api.post<LoginResponseDTO>(authLogin, requestData);
    let aa = response.data;
    console.log(aa);
    return aa;
};