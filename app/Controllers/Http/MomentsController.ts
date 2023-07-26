import {v4 as uuidv4} from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import  Application  from "@ioc:Adonis/Core/Application"

export default class MomentsController {
    private validationOptions = {
        types: ['image'],
        size: '2mb',
    }

    public async store ({request, response}: HttpContextContract) {
        const body = request.body()

       const moment = await Moment.create(body)

       const image = request.file('image', this.validationOptions)

       if(image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'),{
            name: imageName,
        })

        body.image = imageName
       }

    

       response.status(201)

       return {
        message: "Momento criado com sucesso!",
        data: moment, 
       }
    }

    public async index() {
        const moments = await Moment.query().preload("comments")

        return {
            data: moments, 
        }
    }

    public async show({params}: HttpContextContract) {
        const moment = await Moment.findOrFail(params.id)

        return {
            data: moment,
        }
    }

    public async destroy({params}: HttpContextContract){ 
        const moment = await Moment.findOrFail(params.id)

        await moment.delete()

        return {
            message: "Momento exluido com sucesso!",
            data: moment,
        }
    }

    public async uptade({params, request}: HttpContextContract){

        const body = request.body()
        const moment = await Moment.findOrFail(params.id)

        await moment.delete()

        moment.title = body.title
        moment.description = body.description

        if(moment.image != body.image || !moment.image) {
            const image = request.file('image', this.validationOptions)

            if (image) {
                const imageName = `${uuidv4()}.${image.extname}`
    
            await image.move(Application.tmpPath('uploads'),{
                name: imageName,
            })
    
            moment.image = imageName
            }
           }
           await moment.save()

           return {
            message: "Momento atualizado com sucesso!",
            data: moment,
           }


    }
}
