Teilnehmer hinzufügen
```console
curl -X GET http://localhost:3124/admin/survey/1/add
```

Alle Teilnehmer von einem Survey auflisten
```console
curl -X GET http://localhost:3124/admin/survey/1/participants
```

Beim Start der Umfrage wird der Teilnehmer erkannt und im eine Verifzierungs-ID zugewiesen die bei jeder Aktion mit übergeben werden muss.
```console
curl -X GET http://localhost:3124/survey/1/EINES_DER_ID'S_VON_OBEN
```

Sinnvollerweise kann die Verifzierungs-ID im Frontend gespeichert werden.
```js
sessionStorage.setItem('id', json.session);
```

Wie oben erwähnt muss die ID mit Body mitgesendet werden. Falls die ID nicht mit der in der Datenbank gespeicherten ID nicht überein stimmt wird ein Fehler geworfen.
```console
curl -X POST -d '{ "id": "69ab9b90-9abe-11eb-9c05-4dcdec195afd", "answer": "empty" }' http://localhost:3124/survey/1/9eaf2660-9abc-11eb-a540-111460372e3b/answer
```