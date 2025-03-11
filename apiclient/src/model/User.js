/**
 * 智选车API文档
 * 智选车汽车推荐购买平台API文档
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The User model module.
 * @module model/User
 * @version 1.0
 */
class User {
    /**
     * Constructs a new <code>User</code>.
     * @alias module:model/User
     * @param username {String} 
     * @param password {String} 
     * @param email {String} 
     */
    constructor(username, password, email) { 
        
        User.initialize(this, username, password, email);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, username, password, email) { 
        obj['username'] = username;
        obj['password'] = password;
        obj['email'] = email;
    }

    /**
     * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/User} obj Optional instance to populate.
     * @return {module:model/User} The populated <code>User</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new User();

            if (data.hasOwnProperty('userId')) {
                obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
            }
            if (data.hasOwnProperty('username')) {
                obj['username'] = ApiClient.convertToType(data['username'], 'String');
            }
            if (data.hasOwnProperty('password')) {
                obj['password'] = ApiClient.convertToType(data['password'], 'String');
            }
            if (data.hasOwnProperty('email')) {
                obj['email'] = ApiClient.convertToType(data['email'], 'String');
            }
            if (data.hasOwnProperty('phone')) {
                obj['phone'] = ApiClient.convertToType(data['phone'], 'String');
            }
            if (data.hasOwnProperty('userType')) {
                obj['userType'] = ApiClient.convertToType(data['userType'], 'String');
            }
            if (data.hasOwnProperty('registerTime')) {
                obj['registerTime'] = ApiClient.convertToType(data['registerTime'], 'Date');
            }
            if (data.hasOwnProperty('lastLoginTime')) {
                obj['lastLoginTime'] = ApiClient.convertToType(data['lastLoginTime'], 'Date');
            }
            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'Number');
            }
            if (data.hasOwnProperty('avatar')) {
                obj['avatar'] = ApiClient.convertToType(data['avatar'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>User</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>User</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of User.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['username'] && !(typeof data['username'] === 'string' || data['username'] instanceof String)) {
            throw new Error("Expected the field `username` to be a primitive type in the JSON string but got " + data['username']);
        }
        // ensure the json data is a string
        if (data['password'] && !(typeof data['password'] === 'string' || data['password'] instanceof String)) {
            throw new Error("Expected the field `password` to be a primitive type in the JSON string but got " + data['password']);
        }
        // ensure the json data is a string
        if (data['email'] && !(typeof data['email'] === 'string' || data['email'] instanceof String)) {
            throw new Error("Expected the field `email` to be a primitive type in the JSON string but got " + data['email']);
        }
        // ensure the json data is a string
        if (data['phone'] && !(typeof data['phone'] === 'string' || data['phone'] instanceof String)) {
            throw new Error("Expected the field `phone` to be a primitive type in the JSON string but got " + data['phone']);
        }
        // ensure the json data is a string
        if (data['userType'] && !(typeof data['userType'] === 'string' || data['userType'] instanceof String)) {
            throw new Error("Expected the field `userType` to be a primitive type in the JSON string but got " + data['userType']);
        }
        // ensure the json data is a string
        if (data['avatar'] && !(typeof data['avatar'] === 'string' || data['avatar'] instanceof String)) {
            throw new Error("Expected the field `avatar` to be a primitive type in the JSON string but got " + data['avatar']);
        }

        return true;
    }


}

User.RequiredProperties = ["username", "password", "email"];

/**
 * @member {Number} userId
 */
User.prototype['userId'] = undefined;

/**
 * @member {String} username
 */
User.prototype['username'] = undefined;

/**
 * @member {String} password
 */
User.prototype['password'] = undefined;

/**
 * @member {String} email
 */
User.prototype['email'] = undefined;

/**
 * @member {String} phone
 */
User.prototype['phone'] = undefined;

/**
 * @member {module:model/User.UserTypeEnum} userType
 */
User.prototype['userType'] = undefined;

/**
 * @member {Date} registerTime
 */
User.prototype['registerTime'] = undefined;

/**
 * @member {Date} lastLoginTime
 */
User.prototype['lastLoginTime'] = undefined;

/**
 * @member {Number} status
 */
User.prototype['status'] = undefined;

/**
 * @member {String} avatar
 */
User.prototype['avatar'] = undefined;





/**
 * Allowed values for the <code>userType</code> property.
 * @enum {String}
 * @readonly
 */
User['UserTypeEnum'] = {

    /**
     * value: "NORMAL_USER"
     * @const
     */
    "NORMAL_USER": "NORMAL_USER",

    /**
     * value: "DEALER"
     * @const
     */
    "DEALER": "DEALER",

    /**
     * value: "ADMIN"
     * @const
     */
    "ADMIN": "ADMIN"
};



export default User;

