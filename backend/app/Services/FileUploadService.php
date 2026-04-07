<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FileUploadService
{
    private const MAX_SIZE_KB = 5120;

    private function validateAndStore(
        UploadedFile $file,
        array $allowedMimes,
        string $pathPrefix
    ): string {
        if ($file->getSize() > self::MAX_SIZE_KB * 1024) {
            throw ValidationException::withMessages([
                'file' => ['The file must not exceed ' . self::MAX_SIZE_KB . ' KB.'],
            ]);
        }

        if (!in_array($file->getMimeType(), $allowedMimes, true)) {
            throw ValidationException::withMessages([
                'file' => ['Invalid file type. Allowed: ' . implode(', ', $allowedMimes)],
            ]);
        }

        $directory = $pathPrefix . now()->format('Y/m');
        $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();

        Storage::disk('public')->putFileAs($directory, $file, $filename);

        return $directory . '/' . $filename;
    }

    public function storeBonScanne(UploadedFile $file): string
    {
        return $this->validateAndStore(
            $file,
            ['application/pdf', 'image/jpeg', 'image/png'],
            'bons/'
        );
    }

    public function storePhotoJointe(UploadedFile $file): string
    {
        return $this->validateAndStore(
            $file,
            ['image/jpeg', 'image/png', 'image/webp'],
            'photos/'
        );
    }
}
