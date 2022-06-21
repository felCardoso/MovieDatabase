$(function() {
    // Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function() {
      $('#sidebar, #content, #sidebarCollapse').toggleClass('active');
    });
  });

  $(document).ready(function() {
    //busca gêneros e armazena no localstorage
    $.ajax({
      url: "https://api.themoviedb.org/3/genre/movie/list?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR",
      type: "GET",
      contentType: "application/json",
    }).done(function (server_response) {
      window.localStorage.setItem('generos', JSON.stringify(server_response.genres))
    }).fail(function (server_response) {
      console.error("Falha de comunicação com o servidor", server_response);
    });

    function getGenre(id) {
      let genres = JSON.parse(window.localStorage.getItem('generos'))
      let genre = "Não encontrado"
      genres.forEach(element => {
        if(element.id == id){
          genre = element.name
        }
      });

      return genre
    }

    //preenche lançamentos
    $.ajax({
      url: "https://api.themoviedb.org/3/movie/now_playing?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR&page=1",
      type: "GET",
      contentType: "application/json",
    }).done(function (server_response) {
      for(let cont = 0; cont <= 4; cont++) {
        let div = $("#item" + cont)
        div.find(".btnDetalhes").attr('value', server_response.results[cont].id)
        div.find(".lancamentosTitle").text(server_response.results[cont].title)
        div.find(".lancamentosDescricao").text(server_response.results[cont].overview)
        div.find(".tag1").html(getGenre(server_response.results[cont].genre_ids[0]))
        div.find(".tag2").html(getGenre(server_response.results[cont].genre_ids[1]))
        div.find(".tag3").html(getGenre(server_response.results[cont].genre_ids[2]))
        div.find(".lancamentosData").html(formatDate(server_response.results[cont].release_date))
        div.find(".lancamentosNota").html(server_response.results[cont].vote_average)

        for(let i = 1; i <= 10; i++) {
          let starClone = $("#starToClone").clone()
          starClone.removeClass("hidden")
          starClone.removeAttr('id')
          if (i < server_response.results[cont].vote_average) {
            starClone.removeClass("empty")
            starClone.addClass("filled")
          }
          else {
            starClone.removeClass("filled")
            starClone.addClass("empty")
          }

          div.find(".lancamentosNotaDiv").append(starClone)
        }

        //videos
        $.ajax({
          url: "https://api.themoviedb.org/3/movie/" + server_response.results[cont].id + "/videos?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR",
          type: "GET",
          contentType: "application/json",
        }).done(function (server_response) {
          let videoSrc = "https://www.youtube.com/embed/" + server_response.results[0].key
          div.find(".lancamentosVideo").attr('src', videoSrc)
        }).fail(function (server_response) {
          console.error("Falha de comunicação com o servidor", server_response);
        });

        //avaliações
        $.ajax({
          url: "https://api.themoviedb.org/3/movie/" + server_response.results[cont].id + "/reviews?api_key=2e1df8ace23920f40d96768a07c873b1",
          type: "GET",
          contentType: "application/json",
        }).done(function (server_response) {
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

      }
      
    }).fail(function (server_response) {
      console.error("Falha de comunicação com o servidor", server_response);
    });

    //preenche novidades
    $.ajax({
      url: "https://api.themoviedb.org/3/movie/top_rated?api_key=2e1df8ace23920f40d96768a07c873b1&language=pt-BR&page=1",
      type: "GET",
      contentType: "application/json",
    }).done(function (server_response) {
      for(let cont = 0; cont <= 3; cont++) {
        let div = $("#divNovidades" + cont)
        div.find(".btnDetalhes").attr('value', server_response.results[cont].id)
        let imageSrc = "https://image.tmdb.org/t/p/w500" + server_response.results[cont].poster_path
        div.find(".imgNovidades").attr('src', imageSrc)
        div.find(".novidadesTitle").text(server_response.results[cont].title)
        div.find(".novidadesDescription").text(server_response.results[cont].overview)
        div.find(".tag1").html(getGenre(server_response.results[cont].genre_ids[0]))
        div.find(".tag2").html(getGenre(server_response.results[cont].genre_ids[1]))
        div.find(".tag3").html(getGenre(server_response.results[cont].genre_ids[2]))
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

    $(document).on('click', ".btnDetalhes", function() {
      window.localStorage.setItem('movieId', this.getAttribute('value'))
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