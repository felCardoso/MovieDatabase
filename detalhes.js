$(function() {
    // Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function() {
      $('#sidebar, #content, #sidebarCollapse').toggleClass('active');
    });
  });

$(document).ready(function() { 
    //busca detalhes do filme
    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + window.localStorage.getItem('movieId') + "?api_key=5f905d15e608ec3f4444c4e6d0e973ae&language=pt-BR&append_to_response=videos,images,credits,reviews",
        type: "GET",
        contentType: "application/json",
    }).done(function (server_response) {
        $(".lancamentosTitle").text(server_response.title)
        $(".lancamentosDescricao").text(server_response.overview)
        $(".lancamentosData").html(formatDate(server_response.release_date))
        $(".originalTitle").html(server_response.original_title)
        $(".slogan").html(server_response.tagline)
        let cont = 1;
        server_response.production_countries.forEach(element => {
            if (cont == server_response.production_countries.length) {
                $(".production_countries").html($(".production_countries").html() + element.name)
            } else {
                $(".production_countries").html($(".production_countries").html() + element.name + ", ")
            }
            cont++
        });
        cont = 1
        server_response.production_companies.forEach(element => {
            if (cont == server_response.production_companies.length) {
                $(".production_companies").html($(".production_companies").html() + element.name)
            } else {
                $(".production_companies").html($(".production_companies").html() + element.name + ", ")
            }
            cont++
        });
        if (server_response.genres.length >= 3) {
            $(".tag1").html(server_response.genres[0].name)
            $(".tag2").html(server_response.genres[1].name)
            $(".tag3").html(server_response.genres[2].name)
        }
        else if (server_response.genres.length == 2) {
            $(".tag1").html(server_response.genres[0].name)
            $(".tag2").html(server_response.genres[1].name)
            $(".tag3").addClass("hidden")
        }
        else if (server_response.genres.length == 1) {
            $(".tag1").html(server_response.genres[0].name)
            $(".tag2").addClass("hidden")
            $(".tag3").addClass("hidden")
        }
        else {
            $(".tag1").addClass("hidden")
            $(".tag2").addClass("hidden")
            $(".tag3").addClass("hidden")
        }

        for(let i = 1; i <= 10; i++) {
            let starClone = $("#starToClone").clone()
            starClone.removeClass("hidden")
            starClone.removeAttr('id')
            if (i < server_response.vote_average) {
              starClone.removeClass("empty")
              starClone.addClass("filled")
            }
            else {
              starClone.removeClass("filled")
              starClone.addClass("empty")
            }
  
            $(".lancamentosNotaDiv").append(starClone)
        }

        $(".lancamentosNota").html(server_response.vote_average)
        if (server_response.videos.results[0] != undefined) {
            $(".lancamentosVideo").attr('src', "https://www.youtube.com/embed/" + server_response.videos.results[0].key)
        }
        else {
            $(".lancamentosVideo").attr('src', "imagens/no_video.jpg")
        }

        if (server_response.credits.cast.length < 0) {
            $(".noCreditsAvailable").removeClass("hidden")
            $("#diretor").addClass("hidden")
            $("#ator0").addClass("hidden")
            $("#ator1").addClass("hidden")
            $("#ator2").addClass("hidden")
            $("#ator3").addClass("hidden")
            $("#ator4").addClass("hidden")
        } else {
            for(let cont = 0; cont < server_response.credits.crew.length; cont++){
                if (server_response.credits.crew[cont].known_for_department == "Directing") {
                    let diretor =  $("#diretor")
                    diretor.find(".creditsNome").text(server_response.credits.crew[cont].name)
                    if (server_response.credits.crew[cont].profile_path != null) {
                        diretor.find(".imgCredits").attr('src', "https://image.tmdb.org/t/p/w200" + server_response.credits.crew[cont].profile_path)
                    } else {
                        diretor.find(".imgCredits").attr('src', "imagens/sem_foto.webp")
                    }
                    break
                }
            }

            for(let cont = 0; cont < server_response.credits.cast.length || cont <= 4; cont++){
                if (server_response.credits.cast[cont].known_for_department == "Acting") {
                    let ator =  $("#ator" + cont)
                    ator.find(".creditsNome").text(server_response.credits.cast[cont].name)
                    ator.find(".personagem").html(server_response.credits.cast[cont].character)
                    if (server_response.credits.cast[cont].profile_path != null) {
                        ator.find(".imgCredits").attr('src', "https://image.tmdb.org/t/p/w200" + server_response.credits.cast[cont].profile_path)
                    } else {
                        ator.find(".imgCredits").attr('src', "imagens/sem_foto.webp")
                    }
                }
            }
        }
        

    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });

    //avaliaçoes
    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + window.localStorage.getItem('movieId') + "/reviews?api_key=2e1df8ace23920f40d96768a07c873b1",
        type: "GET",
        contentType: "application/json",
    }).done(function (server_response) {
        let div = $("#divLancamentos")
        for (let i = 0; i < 3 && i < server_response.results.length; i++) {
            let avaliacao = div.find(".avaliacoes" + i)
            avaliacao.find(".avaliacaoNome").text(server_response.results[i].author)
            avaliacao.find(".avaliacaoDescricao").html(caracteresLimit(server_response.results[i].content))
            avaliacao.find(".dataAvaliacoes").html(formatDateFromDateType(server_response.results[i].updated_at))
            avaliacao.find(".imgAvaliacoes").attr('src', formatImage(server_response.results[i].author_details.avatar_path))
            avaliacao.find(".imgAvaliacoes").attr('alt', server_response.results[i].author)
            avaliacao.find(".avaliacaoLink").attr('href', server_response.results[i].url)

            for(let j = 1; j <= 10; j++) {
            let starClone = $("#starToClone").clone()
            starClone.removeClass("hidden")
            starClone.removeAttr('id')
            if (j < server_response.results[i].author_details.rating) {
                starClone.removeClass("empty")
                starClone.addClass("filled")
            }
            else {
                starClone.removeClass("filled")
                starClone.addClass("empty")
            }

            avaliacao.find(".avaliacaoStars").append(starClone)
            }
        }

        if (server_response.results.length < 3) {
            div.find(".avaliacoes2").addClass("hidden")
            if (server_response.results.length < 2) {
                div.find(".avaliacoes1").addClass("hidden")
                if (server_response.results.length < 1) {
                    div.find(".avaliacoes0").addClass("hidden")
                    div.find(".noRatingAvailable").removeClass("hidden")
                }
            }
        }

    }).fail(function (server_response) {
    console.error("Falha de comunicação com o servidor", server_response);
    });

    $(document).on('click', ".filterLinkOption", function() { 
        window.localStorage.setItem('movieId', this.getAttribute('value'))
        $("#myInput").val("")
        $("#myInputMobile").val("")
        $("#dropdownDesktopList").html("")
        $("#dropdownMobileList").html("")
        window.location.href = "detalhes.html"
      });
});

function formatDate(date) {
    let data = date.split("-")
    let dataFormatada = data[2] + "/" + data[1] + "/" + data[0]
    return dataFormatada
}

function formatDateFromDateType(datestr) {
let data = new Date(datestr)
let dataFormated = addZero(data.getDate()) + "/" + addZero(data.getMonth() + 1) + "/" + data.getFullYear()
return dataFormated
}

function addZero(number) {
let numberstr = number.toString()
if (numberstr.length < 2) {
    numberstr = "0" + numberstr
}

return numberstr
}

function caracteresLimit(frase) {
let fraseResumida = frase
if (frase.length > 500) {
    fraseResumida = frase.slice(0, 500)
    fraseResumida += "..."
}

return fraseResumida
}

function formatImage(path) {
if (path == undefined) {
    return "imagens/sem_foto.webp"
}
if (path.includes("https")) {
    return path.slice(1)
}
else {
    return "https://www.gravatar.com/avatar" + path
}
}

function showDesktop() {
document.getElementById("myDropdown").classList.toggle("show");
}
  
function filterFunctionDesktop() {
var input, filter, ul, li, a, i;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
div = document.getElementById("myDropdown");
a = div.getElementsByTagName("a");
for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
    a[i].style.display = "";
    } else {
    a[i].style.display = "none";
    }
}

$("#dropdownDesktopList").html("")

//busca filmes
$.ajax({
    url: "https://api.themoviedb.org/3/search/movie?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR&query=" + filter + "&page=1&include_adult=true",
    type: "GET",
    contentType: "application/json",
}).done(function (server_response) {
    $("#dropdownDesktopList").html("")
    let cont = 0;
    server_response.results.forEach(element => {
    let cloneLink = $("#cloneLink").clone()
    cloneLink.removeAttr('id')
    cloneLink.attr('value', server_response.results[cont].id)
    cloneLink.text(server_response.results[cont].title)
    $("#dropdownDesktopList").append(cloneLink)
    cont++
    });
    
}).fail(function (server_response) {
    console.error("Falha de comunicação com o servidor", server_response);
});
}

function showMobile() {
document.getElementById("myDropdownMobile").classList.toggle("show");
}
  
function filterFunctionMobile() {
var input, filter, ul, li, a, i;
input = document.getElementById("myInputMobile");
filter = input.value.toUpperCase();
div = document.getElementById("myDropdownMobile");
a = div.getElementsByTagName("a");
for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
    a[i].style.display = "";
    } else {
    a[i].style.display = "none";
    }
}

$("#dropdownDesktopList").html("")

//busca filmes
$.ajax({
    url: "https://api.themoviedb.org/3/search/movie?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR&query=" + filter + "&page=1&include_adult=true",
    type: "GET",
    contentType: "application/json",
}).done(function (server_response) {
    $("#dropdownDesktopList").html("")
    let cont = 0;
    server_response.results.forEach(element => {
    let cloneLink = $("#cloneLink").clone()
    cloneLink.removeAttr('id')
    cloneLink.attr('value', server_response.results[cont].id)
    cloneLink.text(server_response.results[cont].title)
    $("#dropdownMobileList").append(cloneLink)
    cont++
    });
    
}).fail(function (server_response) {
    console.error("Falha de comunicação com o servidor", server_response);
});
}