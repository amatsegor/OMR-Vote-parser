/**
 * Created by amatsegor on 5/6/17.
 */
import {parseVotingsZip} from "../src/index";

// Parser.parse('Gol20_p1.1.rtf').subscribe(val => console.log(val));

/*Unzipper.unzip("Golos_14_06_17.zip")
 .subscribe(val => {
 Parser.parse(val);
 console.log(val);
 }, err => {

 });

// Downloader.get("http://omr.gov.ua/images/File/DODATKI_2017/Gorsovet/GOLOS/Golos_14_06_17.zip");
Downloader.get("http://omr.gov.ua/images/File/DODATKI_2017/Gorsovet/GOLOS/Golos_14_06_17.zip", filePath => {
    console.log(filePath);
    Unzipper.unzip(filePath)
        .subscribe(val => {
            Parser.parse(val)
                .subscribe(json => {
                });
            console.log(val);
        }, err => {

        })
});
*/

parseVotingsZip("http://omr.gov.ua/images/File/DODATKI_2017/Gorsovet/GOLOS/Golos_14_06_17.zip")
    .subscribe(arr => {
        console.log(arr);
    });