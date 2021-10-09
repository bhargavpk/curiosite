const handleSuccess = googleUser => {

}

const handleFailure = () => {

}


function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

function init() {
        gapi.load('auth2', function() {
          /* Ready. Make a call to gapi.auth2.init or some other API */
        const auth2 = gapi.auth2.init({
                  client_id:"850052351064-g49rc9ins4606o33ujpgdocc31p9fu2m.apps.googleusercontent.com",
                  ux_mode:'prompt',
                //   redirect_uri:'curiosite'
          })

          gapi.signin2.render('login-button-section',{
                scope: 'email',
                width: 250,
                height: 50,
                longtitle: true,
                theme: 'dark',
                onsuccess: handleSuccess,
                onfailure: handleFailure,
                prompt: 'select_account'
              })

        auth2.currentUser.listen(async function(user){
                if(user && user.isSignedIn())
                {
                        const currUser = auth2.currentUser.get()
                        if(currUser.getHostedDomain() !== 'iitbbs.ac.in')
                                auth2.then(function(){
                                        auth2.signOut()
                                        document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
                                })
                        else
                                document.cookie = 'idToken=' + user.getAuthResponse({}).id_token + '; path=/'
                        setTimeout(() => {
                            gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse().then(function(authResponse){
                                if(authResponse)
                                {
                                    document.cookie = 'idToken=' + authResponse.id_token + '; path=/'
                                }
                            })
                        }, 1000*60*50)
                                
                                
                }
                else
                        document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        })

        
        });
}

async function reloadAuthResponse() {
    const googleUser = googleAPI.currentUser.get()
    console.log(googleUser)
}