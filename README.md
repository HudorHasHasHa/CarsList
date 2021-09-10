##### Instalacja
* npm install (wymagane może być użycie flagi --legacy-peer-deps)
* npm run watch 

##### Działanie Aplikacji
* Pierwszą widoczną na górze okna opcją jest dodawanie samochodu do listy, zdecydowałem się na pobranie informacji ze znalezionego w internecie pliku json zawierającego marki samochodów i ich modele oraz umieszczenie ich w dropdownów "marka" "model". Naciskając przycisk dodajemy do listy samochód z zaznaczonymi wartościami.
* Filtrowanie po modelu odbywa się przez wpisanie do widocznego pola frazy, lista filtrowana jest bazując na tym czy dany model rozpoczyna się od podanej przez użytkownika frazy. Wyświetlanie i "usuwanie" rzędów tabeli odbywa się przez zmianę style.display.
* Defaultowo wprowadziłem do pliku initialModels.json 3 przedmioty, które są pobierane i wyświetlane przy starcie aplikacji. 
* W tabeli znajduje się przycisk "edit", który przesyła wartości komórek danego rzędu i pozwala w oknie na ich edycję, zdecydowałem się nie łączyć dodawania i edycji w jednym oknie dlatego, że moim zdaniem modal jest bardziej czytelny przy wyświetleniu jednej wybranej opcji niż całej listy. oczywiście dodawanie również mogłoby znajdować się w osobnym modalu w razie potrzeby.
* W oknie modalnym przycisk save wprowadza do listy zmiany oraz przeładowuje tabelę.
* Delete usuwa rząd tabeli w którym się znajduje.