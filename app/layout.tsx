import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'SeniorCare® — Living Well, Aging Better',template:'%s | SeniorCare®'},description:'Explore senior living options, care services and resources for your family.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
