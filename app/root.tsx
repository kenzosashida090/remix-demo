import {
  Form,
  Link, 
  NavLink,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData, //Retrieve the data from the loader function
    } from "@remix-run/react";
import { json } from "@remix-run/node"; // creates data into json 
import appStylesHref from "./app.css?url"; 
import { getContacts } from "./data";
import { redirect } from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";//Render all the nested routes that render app
import { createEmptyContact } from "./data";
import { useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { useSubmit } from "@remix-run/react";
export const links: LinksFunction = ()=>[
    {rel:'stylesheet', href:appStylesHref}

]
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({request}:LoaderFunctionArgs) =>{
    
    const url = new URL(request.url) // creates a url object
    console.log(url,"==============URL==========")
    const q = url.searchParams.get('q')
    const contacts = await getContacts(q)
    return json({contacts,q}) 
}

export const action = async() => {
    const contact =  await createEmptyContact();
    return redirect(`/contacts/${contact.id}/edit`)
}
export default function App() {
 const {contacts,q} = useLoaderData<typeof loader>(); // from the loader function retrieve whatever returns that 
 const navigation = useNavigation()
 useEffect(()=>{
     const searchField = document.getElementById("q")
     if(searchField instanceof HTMLInputElement){
	 searchField.value = q || ""
     }
 },[q])

 const submit = useSubmit()
 
 return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
	      <Form id="search-form" role="search" onChange={(event)=>{submit(event.currentTarget)}}>
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
		defaultValue={q || ''}
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
	      {
		  contacts.length ?  
		      <ul>
			  {contacts.map((contact)=> (
				<li key={contact.id}>
				    <NavLink to={`/contacts/${contact.id}`} className={({isActive, isPending})=>
					isPending ? 'pending' : isActive ? "active": ""}>
					{contact.first || contact.last ?
					    <>{contact.first} {contact.last}</>
					    :
					    <i>No name </i>
					}
					{
					contact.favorite ? 
						<span>X</span>
					    :
						null
					}
				    </NavLink>
				</li>	
			    
			  ))}
			  
		      </ul>
		    :
		    <p>No contacts yet...</p>
		  }
          </nav>
        </div>
	  <div className={navigation.state === "loading" ? "loading": ""} id="detail">
	    <Outlet/>
	</div>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary(){
    const error = useRouteError()
    console.log(error, "error========================")
    return(
	<html>
	    <head>
		<title>Oh no!</title>
		<Meta/>
		<Links/>
	    </head>
	    <body>
		<div id='error-page'>
		    <h1>Eror {error.status}</h1>
		    <p>{error.data}</p>
		</div>
		<Scripts/>
	    </body>
	</html>
    )
}
