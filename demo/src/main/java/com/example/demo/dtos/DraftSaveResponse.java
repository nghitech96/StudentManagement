package com.example.demo.dtos;

public record DraftSaveResponse(String message, DraftSaveRequest data) {

    public static DraftSaveResponse saved(DraftSaveRequest request) {
        return new DraftSaveResponse("Draft saved successfully.", request);
    }
}
