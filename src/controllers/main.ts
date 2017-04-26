import helpers = require('../modules/helpers');
import { NextFunction, Request, Response } from "express";

class FunctionUtil
  {
    /**
     * Bind all methods on `scope` to that `scope`.
     *
     * @param scope     Usually, pass the value of `this` from your base class.
     */
    static bindAllMethods( scope )
    {
      for (var p in scope)
      {
        // Don't bind if scope[p] is a getter/setter
        var descriptor = Object.getOwnPropertyDescriptor( Object.getPrototypeOf( scope ), p );
        if (descriptor && (descriptor.get || descriptor.set))
          continue;

        // Only bind if scope[p] is a function that's not already a class member
        // the bound function will be added as a class member, referencing the function on the prototype
        if (!Object.prototype.hasOwnProperty.call( scope, p ) && typeof scope[p] == 'function')
          scope[p] = scope[p].bind( scope );
      }
    }
  }

export class MainController {

    private model: any;

    constructor (model){
        this.model = model;
        FunctionUtil.bindAllMethods( this );
    }

    public get (req:Request, res:Response, cb?: Function){
        
        if(req.params.id){
            this.model.findOne({_id : req.params.id}, (err, data)=>{
                res.send(data);
                cb ? cb() : null;
            });
        }

        else{
            let q = helpers.queryBuilder(req);

            this.model.find(q.query).sort(q.sortQuery).exec((err, data)=>{
                res.send(data);
                cb ? cb() : null;
            })
        }

    }

    public upsert (req: Request, res: Response, data: Object, cb?: Function){

        let self = this;

        if(req.params.id){
            let query = {_id : req.params.id};
            this.model.update(query, data, (err, data)=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send(data);
                }
                cb ? cb() : null;
            })
        }
        else{
            let newModelInstance = new this.model(data);
            newModelInstance.save((err, doc)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send(doc)
                }
                cb ? cb() : null;
            })
        }

    }

    public delete (req: Request, res:Response, cb?:Function) {

        if(req.params.id){
            this.model.findOneAndUpdate({_id : req.params.id}, {deleted : true}, (err, data)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send(data);
                }
                cb ? cb() : null;
            })
        }
        else{
            res.send({error : "Please provide more info"});
        }

    }

}
