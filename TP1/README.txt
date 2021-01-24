Bonjour Monsieur,

Pour ce TP j'ai fait plusieurs choix en fonction de mon interprétation de l'énoncé, tout d'abord mes cookies ne se suppriment pas quand on fait un match à trois ou plus (en draggant ou en swappant avec les clicks) mais il y a un bouton
pour les supprimer. J'ai fait ce choix car si on les supprimait dès qu'il y avait un match on aurait pas pu voir l'effet du bouton permet d'afficher les cookies formant une ligne/colonne de 3 ou plus. Il y a donc 3 boutons comme vous pouvez 
voir sur le index.html, j'ai choisi de faire un bouton pour tout déselectionner car ça ne coûtait pas de temps et de plus j'ai réfléchi un peu dans l'optique d'un jeu, c'est-à-dire que le joueur clique sur le bouton pour voir les matchs
et ensuite la sélectionne des cookies disparait. Je n'ai pas fait ça avec un timer (await avec fonction async) car je ne comprenais pas trop le fonctionnement. Je n'ai pas ajouté votre méthode pour avoir un tableau mélangé (sans match)
car je ne voyais pas l'intérêt pour voir car au moins si il y a des matchs dès le début vous pouvez tester plus rapidement les 3 boutons.
Enfin j'ai essayé de faire les chutes néanmoins je me suis heurté à un problème:
- Je remplis la première ligne avec de nouveaux cookies, et la chute s'effectue bien sur la seconde mais au delà de la deuxième ligne la chute ne veut plus s'effectuer, Uncaught TypeError: Cannot read property 'marque' of undefined j'obtiens 
cette erreur et j'ai essayé de modifier les méthodes de chute (avec marque ou type) mais c'est toujours le même problème.
Avec le code que vous pouvez voir dans chute je m'attendais à avoir des cookies qui échangent leurs places tant qu'il y a un cookie sur la ligne principal (CookieActuel) mais ce n'est pas le cas à partir de la ligne 3, même si ligne actuelle
a un cookie l'échange ne s'effectue pas avec la colonne du dessous.
Pour la suite j'aurais voulu coder le moment où il n'y a pas de cookies sur deux lignes (à l'indice colonne) d'affilée, j'aurais ensuite écrit une condition dans laquelle j'aurais cherché sur les lignes du dessus un cookie et je l'aurais 
fait tomber jusqu'à la bonne ligne.
