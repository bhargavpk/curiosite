import React from 'react';
import Header from './header';
import './Layout.css';

export default function Layout(props){
    return(
        <div>
            <Header />
            <div className="content_body">
                {props.children}
            </div>
        </div>
    );
}