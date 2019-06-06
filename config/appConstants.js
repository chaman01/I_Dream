'use strict';

let DATABASE = {
    PROJECT: 'PROJECT',
    USER_ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER',
        COMMON:'COMMON'
    },
    TOKEN_FIELDS :{
        ACCESS_TOKEN : 'accessToken',
        EMAIL_VERIFICATION : 'emailVerificationToken',
        PASSWORD_RESET : 'passwordResetToken'
    },
}


let REQUEST_STATUS={
    PENDING:1,
    ONGOING:2,
    PAST:3,
    CANCELLED:4
}

let ANNOUNCEMENT_TYPE={
    STUDENT:1,
    TEACHER:2
};


let COMMON_SERVICE_TYPE={
    EDUCATION_LAVEL:1,
    EDUCATION_TYPE:2,
    STUDY_LOCATION:3,
    GENDER:4,
    CONTACT_US:5,
    SUBJECT:6,
    SERVICE_TYPE:7,
    SUITABLE_PERIOD:8,
    DYNAMIC_TEXT:9,
    COMPLAINT_REASON:10,
    MAXIMUM_STUDENT:11
}

let DYNAMIC_TEXT_TYPE={
    DEFAULT:0,
    FAVOURITE_TEACHER_DISCOUNT:1
}

let TCP_SERVICES={
    KNOW_MORE:1,
    ABOUT_US:2,
    TERMS_CONDITIONS:3,
    PRIVACY_POLICY:4
}


let CLASS_STATUS={
    PENDING:1,
    COMPLETED:2,
    CANCELLED:3
}



let GENDER_TYPE={
    MALE:1,
    FEMALE:2
}

let USER_TYPE={
    STUDENT:1,
    TEACHER:2
}


let PUSH_TYPE={
    BROAD_CAST:1,
    SUBSCRIBE:2
}

let LANGUAGE_TYPE={
    ENGLISH:1,
    ARABIC:2
}

let DEVICE_TYPE={
    ANDROID:"ANDROID",
    IOS:"IOS",
    WEB:"WEB"
}

let OFFER_STATUS={
    PENDING:1,
    ACCEPTED:2,
    REJECTED:3,
    CANCELLED:4
}

let TRANSACTION_STATUS={
    PAID:1,
    REFUNDED:2
}

let OFFER_SORT_TYPE={
    RATTING:1,
    DISTANCE:2,
    PRICE:3,
    CLASSES:4
}


let ISSUE_TYPE={
    SUPPORT:1,
    COMPLAINT:2
}


let VERIFICATION_INFO_STEP={
    ONE:1,
    TWO:2,
    THREE:3
}

let STATUS_MSG = {
    ERROR: {

        TYPE_ALREADY_EXISTS:{
            statusCode:401,
            customMessage : 'Type already exists',
            type : 'TYPE_ALREADY_EXISTS'
        },

        INVALID_TOKEN:{
            statusCode:401,
            customMessage : 'Your session has been expired.',
            type : 'INVALID_TOKEN'
        },

        INVALID_OTP_ID:{
            statusCode:400,
            customMessage : 'Invalid otp provided',
            type : 'INVALID_OTP_ID'
        },

        FOLDER_ALREADY:{
            statusCode:400,
            customMessage : 'Folder with same name is already there',
            type : 'FOLDER_ALREADY'
        },

        REQUEST_TEMPORARY_UNAVAILABLE:{
            statusCode:400,
            customMessage : 'Sorry, this request is temporary unavailable',
            type : 'REQUEST_TEMPORARY_UNAVAILABLE'
        },

        OFFER_EXPIRED:{
            statusCode:400,
            customMessage : 'Sorry, this this offer has been expired',
            type : 'OFFER_EXPIRED'
        },


        OFFER_TEMPORARY_UNAVAILABLE:{
            statusCode:400,
            customMessage : 'Sorry, this offer is temporary unavailable',
            type : 'OFFER_TEMPORARY_UNAVAILABLE'
        },

        OFFER_CANCELLED:{
            statusCode:400,
            customMessage : 'Sorry, this offer has been cancelled',
            type : 'OFFER_CANCELLED'
        },

        REQUEST_EXPIRED:{
            statusCode:400,
            customMessage : 'Sorry, this request has been expired',
            type : 'REQUEST_EXPIRED'
        },

        OTP_EXPIRED:{
            statusCode:400,
            customMessage : 'the otp you have entered has expired',
            type : 'OTP_EXPIRED'
        },

        DUPLICATE_CATEGORY:{
            statusCode:400,
            customMessage : 'Category name you have entered is already registered',
            type : 'DUPLICATE_CATEGORY'
        },

        UNAUTHORIZED:{
            statusCode:401,
            customMessage : 'You are not authorized to perform this action',
            type : 'UNAUTHORIZED'
        },

        INVALID_EMAIL:{
            statusCode:400,
            customMessage : 'The email address you have entered does not match.',
            type : 'INVALID_EMAIL'
        },
        ALREADY_EXISTS:{
            statusCode:400,
            customMessage : 'fullNumber name already exists',
            type : 'ALREADY_EXISTS'
        },
        PHONE_ALREADY_EXISTS:{
            statusCode:400,
            customMessage : 'USER with same PhoneNo. already exists',
            type : 'PHONE_ALREADY_EXISTS'
        },
        ALREADY_EXISTS_EMAIL:{
            statusCode:400,
            customMessage : 'User with same email already exists',
            type : 'ALREADY_EXISTS_EMAIL'
        },
        ALREADY_EXISTS_WEBSITE:{
            statusCode:400,
            customMessage : 'USER with same website already exists',
            type : 'ALREADY_EXISTS_WEBSITE'
        },

        BLOCKED_BY_ADMIN:{
            statusCode:400,
            customMessage : 'Your account has been suspended by admin please contact to comvo',
            type : 'BLOCKED_BY_ADMIN'
        },

        SOMETHING_WENT_WRONG:{
            statusCode:400,
            type: 'SOMETHING_WENT_WRONG',
            customMessage : 'Something went wrong on server. '
        },
        IMP_ERROR: {
            statusCode:500,
            customMessage : 'Implementation Error',
            type : 'IMP_ERROR'
        },

        DB_ERROR: {
            statusCode: 400,
            customMessage: 'DB Error : ',
            type: 'DB_ERROR'
        },
        DUPLICATE: {
            statusCode: 400,
            customMessage: 'Duplicate Entry',
            type: 'DUPLICATE'
        },
        DUPLICATE_ADDRESS:{
            statusCode: 400,
            customMessage: 'Duplicate address',
            type: 'DUPLICATE_ADDRESS'
        },
        APP_ERROR:{
            statusCode: 400,
            customMessage: 'Application error ',
            type: 'APP_ERROR'
        },
        INVALID_ID:{
            statusCode: 400,
            customMessage: 'Invalid id ',
            type: 'INVALID_ID'
        },

        APPROVE_EMAIL:{
            statusCode:400,
            customMessage : 'Please verify your email first',
            type : 'APPROVE_EMAIL'
        }
    },
    SUCCESS: {

        OTP_SEND_SUCCESS:{
            statusCode:200,
            customMessage :'Otp send successfully',
            type : 'OTP_SEND_SUCCESS'
        },
        SOCKET_CONNECTED:{
            statusCode:200,
            customMessage : 'Connected Successfully',
            type : 'SOCKET_CONNECTED'
        },

        CREATED:{
            statusCode:200,
            customMessage : 'Created Successfully',
            type : 'CREATED'
        },
        REGISTERED:{
            statusCode:200,
            customMessage : 'Registered Successfully',
            type : 'REGISTERED'
        },
        OTP_SENT:{
            statusCode:200,
            customMessage : 'OTP sent successfully',
            type : 'OTP_SENT'
        },
        APPROVED:{
            statusCode:200,
            customMessage : 'Approved Successfully',
            type : 'APPROVED'
        },
        DELETED:{
            statusCode:200,
            customMessage : 'Deleted Successfully',
            type : 'DELETED'
        },
        DEFAULT:{
            statusCode:200,
            customMessage : 'Updated Successfully',
            type : 'DEFAULT'
        },
        VERIFIED:{
            statusCode:200,
            customMessage : 'Verified Successfully',
            type : 'VERIFIED'
        },
        VERIFICATION:{
            statusCode:200,
            customMessage : 'Verification link sent successfully',
            type : 'VERIFICATION'
        },

        APPROVE_EMAIL:{
            statusCode:200,
            isVerified:false,
            customMessage : 'Please verify your email first',
            type : 'APPROVE_EMAIL'
        },

    }
}

let swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Data Not Found'},
    {code: 500, message: 'Internal Server Error'}
];

let NOTIFICATION_TYPE = {
    NEW_REQUEST:1,
    OFFER_MADE:2,
    OFFER_ACCEPTED:3,
    OFFER_REJECTED:4,
    USER_RATED:5,
    ADMIN_NOTIFICATION:6
}

let notificationMessages = {
    registrationEmail:{
        emailSubject:'welcome to abjad',
        emailMessage:''
    },
    donationRequest:{
        emailSubject:'New Requests',
        emailMessage:''
    },
    welcome:{
        emailSubject:'',
        emailMessage:''
    },
    newDonner:{
        emailSubject:'',
        emailMessage:''
    },

    forgotPassword:{
        emailSubject:'Reset Password For abjad',
    },

}
var APP_CONSTANTS = {
    TRANSACTION_STATUS:TRANSACTION_STATUS,
    CLASS_STATUS:CLASS_STATUS,
    ISSUE_TYPE:ISSUE_TYPE,
    VERIFICATION_INFO_STEP:VERIFICATION_INFO_STEP,
    OFFER_SORT_TYPE:OFFER_SORT_TYPE,
    DYNAMIC_TEXT_TYPE:DYNAMIC_TEXT_TYPE,
    OFFER_STATUS:OFFER_STATUS,
    TCP_SERVICES:TCP_SERVICES,
    COMMON_SERVICE_TYPE:COMMON_SERVICE_TYPE,
    ANNOUNCEMENT_TYPE:ANNOUNCEMENT_TYPE,
    USER_TYPE:USER_TYPE,
    GENDER_TYPE:GENDER_TYPE,
    LANGUAGE_TYPE:LANGUAGE_TYPE,
    PUSH_TYPE:PUSH_TYPE,
    REQUEST_STATUS:REQUEST_STATUS,
    DEVICE_TYPE:DEVICE_TYPE,
    DATABASE:DATABASE,
    STATUS_MSG: STATUS_MSG,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
    NOTIFICATION_TYPE: NOTIFICATION_TYPE
};

module.exports = APP_CONSTANTS;
