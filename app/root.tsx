import {
  Form,
  Link,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData, //Retrieve the data from the loader function
    } from "@remix-run/react";
import { json } from "@remix-run/node"; // creates data into json 
import appStylesHref from "./app.css?url"; 
import { getContacts } from "./data";
import { useRouteError } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";//Render all the nested routes that render app

export const links: LinksFunction = ()=>[
    {rel:'stylesheet', href:appStylesHref}

]

export const loader = async () =>{
    const contacts = await getContacts()
    return json({contacts}) 
}
export default function App() {
 const {contacts} = useLoaderData<typeof loader>(); // from the loader function retrieve whatever returns that 
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
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
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
				    <Link to={`/contacts/${contact.id}`}>
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
				    </Link>
				</li>	
			    
			  ))}
			  
		      </ul>
		    :
		    <p>No contacts yet...</p>
		  }
          </nav>
        </div>
        <Outlet/>
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
