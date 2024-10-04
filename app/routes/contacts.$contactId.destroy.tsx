import type { ActionFunctionArgs } from "@remix-run/node"
import { deleteContact } from "~/data"
import { redirect } from "@remix-run/node"
import invariant from "tiny-invariant"
export const action = async ({params}: ActionFunctionArgs) =>{
    invariant(params.contactId, "Missing contactId")
    await deleteContact(params.contactId)
    return redirect("/")

}
