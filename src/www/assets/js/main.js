// @ts-nocheck

"use strict";
    
// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

var jQuery = jQuery || window.jQuery;
var ReImg = ReImg || window.ReImg;

(function($){
    let selectFile = function(){
        return new Promise(resolve => {
            let input = document.createElement("input");
            input.type = "file";
            input.multiple = false;
            input.accept = "image/*";
    
            input.onchange = _ => {
                let files = Array.from(input.files);
                resolve(files[0]);
            };
    
            input.click();
        });
    }

    let togglePopup = function(){
        $("section.main > .canvas-popup-outer").toggleClass("open");
    };

    let generateSFC = function(){
        let canvasElement = document.getElementById("res");
        let context = canvasElement.getContext("2d");
    
        let pb = new Image();
        pb.src = $("a#schmuser-bild").attr("data-src") || "/img/schmus.png";
        pb.crossOrigin = "anonymous";
        pb.onload = function(){
            context.fillStyle = "#161618"; // richtiges grau
            context.fillRect(958, 107, 419, 419);
            context.drawImage(pb, 958, 107, 419, 419);

            let img = new Image();
            img.src = "/img/sfc_ausweis_template_new.png";
            img.crossOrigin = "anonymous";
            img.onload = function(){
                context.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
                context.lineWidth = 1;
                context.fillStyle = "#000";
                context.lineStyle = "#ffff00";
                context.font = "bold 42px sans-serif";

                context.fillText(($("#pr0-name").val() || "Max Schmustermann"), 88, 395);

                let dateStr = ($("#schmuser-bd-tag").val()   || "01") + "." + 
                              ($("#schmuser-bd-monat").val() || "01") + "." + 
                              ($("#schmuser-bd-jahr").val()  || "1990");

                context.fillText(dateStr, 88, 555);

                context.fillStyle = "#FFF";
                context.font = "bold 49px sans-serif";
                context.fillText(($("#schmuser-name").val() || "Schmusi"), 1025, 750);

                togglePopup();
            };
        };
    };

    $(document).ready(function(){
        // Open external links in new tab
        $("a").attr("target", function(){
            if (this.host && this.host != location.host) return "_blank";
        });

        $("a").attr("rel", function(){
            if (this.host && this.host != location.host) return "noopener";
        });

        $("a#schmuser-bild").on("click", async function(){
            let file = await selectFile();
            $(this).css({
                "background": `rgba(255, 255, 255, 0.5) url("${URL.createObjectURL(file)}") center center no-repeat`,
                "background-size": "cover"
            }).attr("data-src", URL.createObjectURL(file));
        });

        $("a#sfc-generate").on("click", function(e){
            e.preventDefault();
            generateSFC();
        });

        $("a.download-btn").on("click", function(e){
            e.preventDefault;
            ReImg.fromCanvas(document.getElementById("res")).downloadPng();
        });

        $("a.abort-btn").on("click", function(e){
            e.preventDefault;
            togglePopup();
        });
    });
})(jQuery);
