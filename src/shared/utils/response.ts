export const successResponse = (data: any, message: string = 'Success') => {
    return {
        status: 'success',
        message,
        data
    };
};

export const errorResponse = (message: string, statusCode: number) => {
    return {
        status: 'error',
        message,
        statusCode
    };
};