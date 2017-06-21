"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by amatsegor on 5/6/17.
 */
const Parser_1 = require("../src/Parser");
const Unzipper_1 = require("../src/Unzipper");
const Downloader_1 = require("../src/Downloader");
// Parser.parse('Gol20_p1.1.rtf');
/*Unzipper.unzip("Golos_14_06_17.zip")
 .subscribe(val => {
 Parser.parse(val);
 console.log(val);
 }, err => {

 });*/
// Downloader.get("http://omr.gov.ua/images/File/DODATKI_2017/Gorsovet/GOLOS/Golos_14_06_17.zip");
Downloader_1.Downloader.get("http://omr.gov.ua/images/File/DODATKI_2017/Gorsovet/GOLOS/Golos_14_06_17.zip", filePath => {
    console.log(filePath);
    Unzipper_1.Unzipper.unzip(filePath)
        .subscribe(val => {
        Parser_1.Parser.parse(val)
            .subscribe(json => {
        });
        console.log(val);
    }, err => {
    });
});
//# sourceMappingURL=example1.js.map