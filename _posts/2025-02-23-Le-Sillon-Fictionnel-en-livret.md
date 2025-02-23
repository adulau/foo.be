---
layout: post
title: "Le Sillon Fictionnel en livret PDF et EPUB"
date: 2025-02-23 14:02:00
categories: internet 
---

J’ai toujours des idées à la con… Il y avait une issue sur GitHub pour créer un petit livret en PDF et EPUB de notre [brol sillonesque](https://sillon-fictionnel.club/). *L’optimisme est toujours l’apanage des fous*. Comme le chat n’était pas en super forme, je me suis dit que travailler sur l’ordinateur serait facile tout en lui tenant compagnie.

Je commence en me disant qu’une conversion de [pages HTML](https://github.com/adulau/sillon-fictionnel/tree/main/content/post) vers un [livre PDF](https://sillon-fictionnel.club/le-sillon-revue.pdf) serait simple. C’était sans compter l’essence même d’un site web avec des pages en Markdown. Ces pages sont uniques. Concaténer n’est pas une solution. Donc, on démarre avec un [petit programme Python pour rassembler le tout](https://github.com/adulau/sillon-fictionnel/blob/main/outils/isbn.py).

Puis viennent les notes de bas de page avec des références uniques… On se dit qu’il suffit d’une indexation globale, rien de bien méchant. On pense : « OK, il reste 10 minutes et c’est ficelé. » Mais là, on se rend compte que la conversion Markdown vers LaTeX, c’est bien, sauf qu’il faut retravailler le TeX pour rendre le tout lisible… et puis survient le cauchemar des tailles et formats d’images.

L’optimisme reprend le dessus grâce au super logiciel libre [Pandoc](https://pandoc.org/)… On avance, mais les images restent un foutoir innommable. On découvre que Pandoc fait du Lua et qu’on peut [filtrer/modifier les figures](https://github.com/adulau/sillon-fictionnel/blob/main/outils/revue.lua). Allez, on se remet au Lua. Puis on tombe sur d’autres joyeusetés, comme la police [EB Garamond qui ne passe pas via Fontconfig](https://github.com/adulau/sillon-fictionnel/blob/main/outils/revue.sh#L13)… et j’en passe.

Mais au final, après quatre litres de thé noir du Mozambique, un chat qui vous fixe bizarrement et quelques expérimentations, [ça fonctionne](https://sillon-fictionnel.club/apropos/#le-sillon-en-revue) ! Avec, en prime, [Le Sillon au format EPUB](https://sillon-fictionnel.club/le-sillon-revue.epub) pour les liseuses.

![Le Sillon Fictionnel est désormais disponible au format EPUB pour vos liseuses, ainsi qu’en PDF et sur le site web sillonesque.](https://paperbay.org/system/media_attachments/files/114/054/039/747/703/185/original/990ec95a61b80daf.png)
