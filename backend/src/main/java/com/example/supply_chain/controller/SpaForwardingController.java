package com.example.supply_chain.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping({
            "/{path:^(?!api$|swagger-ui$|v3$)[^.]*}",
            "/{path:^(?!api$|swagger-ui$|v3$).*$}/**/{subpath:[^.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
