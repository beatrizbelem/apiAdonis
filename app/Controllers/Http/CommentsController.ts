import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {

    public async store({request, params, response}: HttpContextContract) {
        const body = request.body()
        const momentId = params.momentId

        await Moment.findOrFail(momentId)

        body.momentId = momentId

        const comment = await Comment.create(body)

        response.status(201)

        return {
            message: "Comentario adicionado com sucesso",
            data: comment,
        }
    }
}
