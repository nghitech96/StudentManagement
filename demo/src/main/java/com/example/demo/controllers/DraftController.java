package com.example.demo.controllers;

import jakarta.validation.Valid;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.DraftSaveRequest;
import com.example.demo.dtos.DraftSaveResponse;

@RestController
@RequestMapping("/api/drafts")
public class DraftController {

    @PostMapping
    public ResponseEntity<DraftSaveResponse> saveDraft(@Valid @RequestBody DraftSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(DraftSaveResponse.saved(request));
    }
}
