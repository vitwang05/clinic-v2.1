export interface UserDTO {
    id: number;
    phoneNumber: string;
    email: string;
    roleName: string;
}

export const toUserDTO = (user: any): UserDTO => {
    return {
        id: user.id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        roleName: user.role?.name || ''
    };
}; 