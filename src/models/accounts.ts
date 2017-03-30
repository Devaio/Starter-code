import {Document, Schema, Model, model} from 'mongoose';
import passwords = require('../modules/passwords');

// add mongoose Document to interface
interface AccountModel extends Document {
    name? : string,
    email? : string,
	password? : string,
	role? : string,
}

var AccountSchema: Schema = new Schema({
    name : String,
	email : {type : String, required : true, unique : true},
	password : {type : String, required : true},
	role : String
});

AccountSchema.pre('save', function(next){
    if(!this.isModified('password')){
        return next();
    }

    var user = this;
    user.password = passwords.encrypt(user.password);
    return next();
});

export const Account: Model<AccountModel> = model<AccountModel>("Account", AccountSchema);
