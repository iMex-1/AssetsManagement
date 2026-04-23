<?php

namespace Database\Seeders;

use App\Models\Fournisseur;
use Illuminate\Database\Seeder;

class FournisseurSeeder extends Seeder
{
    public function run(): void
    {
        $fournisseurs = [
            ['raison_sociale' => 'TechSupply SARL',        'telephone' => '0522334455'],
            ['raison_sociale' => 'Bureau Plus',             'telephone' => '0537889900'],
            ['raison_sociale' => 'Informatique Pro',        'telephone' => '0661223344'],
            ['raison_sociale' => 'Fournitures Modernes',    'telephone' => '0523445566'],
            ['raison_sociale' => 'Équipements & Services',  'telephone' => '0537112233'],
        ];

        foreach ($fournisseurs as $f) {
            Fournisseur::firstOrCreate(['raison_sociale' => $f['raison_sociale']], $f);
        }
    }
}
