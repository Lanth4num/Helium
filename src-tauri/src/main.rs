// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::env;
use markdown::{to_html_with_options, CompileOptions, Options};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// function to replace symbols to html class:
// @ Test @ -> <span class="spoiler"> Test </span>
fn spoiler_parser(string: &str, symbol: char)-> String{

    let mut main_part = "".to_string();
    let mut next_part = "".to_string();
    let mut is_symbol_opened = false; // @asefsef -> true -> @asefsef@ -> false
    //                                          ^                     ^
    
    for char in string.chars(){
        if char == '\n'{
            // if the symbol was opened:
            if is_symbol_opened {
                main_part.push(symbol);
            }
            // append next_part and clear
            main_part.push_str(&next_part);
            next_part.clear();
            // reset is_symbol_opened
            is_symbol_opened = false;

            main_part.push('\n');

        }
        // when it finds a symbol
        else if char == symbol {
            if is_symbol_opened {
                // merge both parts and the <span> to the main_part
                main_part.push_str("<span class='spoiler'>");
                main_part.push_str(&next_part);
                main_part.push_str("</span>");
                next_part.clear();

                is_symbol_opened = false;
            }
            else {
                is_symbol_opened = true;
            }
        } else{ // if no symbol is found, just add it to the mainPart / secondPart
            if is_symbol_opened {
                next_part.push(char);
            }
            else {
                main_part.push(char);
            }
        }
    }

    return main_part;

}

#[tauri::command]
fn md_parsing(file_path: &str) -> String {

    let file_content = fs::read_to_string(file_path).expect("file read");
    let content_with_spoiler = spoiler_parser(&file_content, '@');

    let converted_html = to_html_with_options(&content_with_spoiler, &Options{
        compile: CompileOptions{
            allow_dangerous_html: true,
            ..CompileOptions::gfm()
        },
        ..Options::gfm()
    }).expect("file reading failed");

    return converted_html;

}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, md_parsing])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
