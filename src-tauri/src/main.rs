// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::env;
use markdown::{to_html_with_options, CompileOptions, Options};
use tauri:: {api::shell::open, Manager, AppHandle};


const SPOILER_ARGUMENTS: [char;2] = ['_', '/'];

fn is_argument(char:char) -> bool{
    for a_char in SPOILER_ARGUMENTS{
        if a_char == char {return true}
    }
    return false
}

// put <span class=''></span> arround the content with specified class
fn into_span(content: &str,class_list:&Vec<&str>)-> String{
    let mut span: String= "<span class='".to_string();

    // opening tag
    for class in class_list.iter(){
        span.push_str(" ");
        span.push_str(class);
    }
    span.push_str("'>");

    // main part
    span.push_str(content);

    // ending tag
    span.push_str("</span>");

    return span;
}

// function to replace symbols to html class:
// @ Test @ -> <span class="spoiler"> Test </span>
fn spoiler_parser(string: &str, symbol: char)-> String{

    let mut main_part = "".to_string();
    let mut next_part = "".to_string();
    let mut is_symbol_opened = false; // @asefsef -> true -> @asefsef@ -> false

    let mut span_classes: Vec<&str> = Vec::new();
    span_classes.push("spoiler");
    
    let mut chars = string.chars().peekable();

    while let Some(char) = chars.next(){
        if char == '\n'{
            // if the spoiler was opened:
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
                main_part.push_str(&into_span(&next_part,&span_classes));
                next_part.clear();

                // clear list for argument handling
                span_classes.clear();

                span_classes.push("spoiler");
                is_symbol_opened = false;
            }
            else {  //if symbol is not opened
                is_symbol_opened = true;
                // check for arguments like "_"
                loop{
                    if let Some(&c) = chars.peek() {
                        if !is_argument(c) {break;}
                        if c == '_' {
                            span_classes.push("underscore");
                        } else if c == '/' {
                            span_classes.push("no-space");
                        }
                        chars.next();
                    }
               }

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
// returns a list of html strings, each element is htmltext of one slide
fn md_parsing(file_path: &str) -> Vec<String> {

    let mut content_list = Vec::new();
    let file_content = fs::read_to_string(file_path).expect("file read");

    // normalize weird windows newline char '\r\n'
    let normalize_content = file_content.replace("\r\n", "\n");

    let slide_list:Vec<&str> = normalize_content.split("\n===\n").collect();

    for slide in slide_list{
        let content_with_spoiler = spoiler_parser(slide, '@');

        let converted_html = to_html_with_options(&content_with_spoiler, &Options{
            compile: CompileOptions{
                allow_dangerous_html: true,
                ..CompileOptions::gfm()
            },
            ..Options::gfm()
        }).expect("file reading failed");

        content_list.push(converted_html);
    }

    return content_list;

}

#[tauri::command]
fn open_link(app: AppHandle, link: &str){
    let _ = open(&app.shell_scope(), link, None).expect("Failed to open link");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![md_parsing, open_link])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
