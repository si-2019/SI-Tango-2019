var TemeAjax = (function(){
    var konstruktor = function(divSadrzaj){
        
        var ajax=new XMLHttpRequest();
        ajax.onreadystatechange=function(){
            
            if(ajax.readyState==4 && ajax.status==200){
                
                var arr = JSON.parse(ajax.responseText);
                
                for (var i=0; i < arr.length; i++) {

                    var nazivTeme = arr[i].nazivTeme;  
                    var nazivAutoraTeme = arr[i].nazivAutoraTeme;
                    var datum = arr[i].datumKreiranjaTeme;
					var slika = arr[i].slikaTeme;
					var brojKomentara = arr[i].brojKomentara;

                    var htmlDiv = document.createElement('div');
                    htmlDiv.className = '';  // treba odrediti css klasu ovog diva tj. naziv...

                    htmlDiv.innerHTML = "Naziv teme: " + nazivTeme + "<br /> Naziv autora teme: " + nazivAutoraTeme + "<br /> Datum: " + datum + "<br /> Slika: " + slika + "<br /> Broj komentara: " + brojKomentara;

                    divSadrzaj.appendChild(htmlDiv);
                }
            }

            else if(ajax.readyState==4 && ajax.status== 404){
                document.getElementById("glavni").innerHTML="Error 404";
            }
        }
        ajax.open("GET","http://localhost:8080/godine" ,true);
        ajax.send();

        return {
    
        }
    }
});