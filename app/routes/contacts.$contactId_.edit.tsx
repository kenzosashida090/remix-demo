
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"
import { getContact, updateContact } from "~/data"
export const loader = async({params}: LoaderFunctionArgs)=>{
    invariant(params.contactId, 'Missing contact Id param')
    const contact  = await getContact(params.contactId)
    console.log(contact,"===EDIT=======")
    if(!contact) throw new Response("Contact not found",{status:404})
    return json({contact})
    
}


export const action = async({params,request}: ActionFunctionArgs) => { 
    invariant(params.contactId, 'Missing contactId  param');
    const formData = await request.formData();
    const updates = Object.fromEntries(formData) // transforms the formData key values into an object
    await updateContact(params.contactId, updates)
    return redirect(`/contacts/${params.contactId}`)
}



export default function ContactEdit() {
    const {contact} = useLoaderData<typeof loader>();
    console.log('from coantact componetn', contact) 
    
    return( 
    <>
	<h1>Hi, {contact?.first} </h1>
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
    </>
	)
}


