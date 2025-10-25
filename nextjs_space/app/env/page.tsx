"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const EnvSetupPage: React.FC = () => {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const onSave = async () => {
    setSaving(true);
    const res = await fetch("/api/env", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: value,
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({
        title: "Falha ao salvar .env",
        description: data?.error ?? "Verifique o conteúdo e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Arquivo .env salvo",
      description: "Agora reinicie ou reconstrua a aplicação para aplicar as variáveis.",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Variáveis (.env)</CardTitle>
          <CardDescription>
            Cole aqui o conteúdo do seu arquivo .env (copiado via SSH) e clique em salvar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Este arquivo deve conter as variáveis descritas em ENV_SETUP.md (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ABACUSAI_API_KEY, AWS_* e opcionalmente GROQ_API_KEY).
            </AlertDescription>
          </Alert>

          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Exemplo:\nDATABASE_URL='postgresql://user:pass@host:5432/db'\nNEXTAUTH_SECRET='...'\nNEXTAUTH_URL='http://localhost:3000'\nABACUSAI_API_KEY='...'\nAWS_PROFILE='hosted_storage'\nAWS_REGION='us-west-2'\nAWS_BUCKET_NAME='...'\nAWS_FOLDER_PREFIX='uploads/'\nGROQ_API_KEY='...'`}
            className="min-h-[300px]"
          />

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar .env"}
            </Button>
          </div>

          <Alert>
            <AlertTitle>Próximos passos</AlertTitle>
            <AlertDescription>
              Após salvar, use “Rebuild” para instalar dependências e aplicar as variáveis ou “Restart” para recarregar o servidor.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvSetupPage;