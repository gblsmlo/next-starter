// Esse arquivo é executado antes de cada ARQUIVO de teste.
// Ideal para configurar jest-dom, mocks globais, ou resetar estados entre arquivos.

import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'

import '@testing-library/jest-dom/vitest'

import * as matchers from '@testing-library/jest-dom/matchers'

// import { clearDrizzleTodoTable } from '@/core/todo/__tests__/utils/clear-drizzle-todo-table';

// Estende o expect global com os matchers do jest-dom
// Sem isso, pode aparecer warning do tipo "You might have forgotten to wrap an update in act(...)"
expect.extend(matchers)

// Essa função roda automaticamente depois de **cada** teste
// Serve pra limpar tudo e evitar que um teste interfira no outro
afterEach(async () => {
	// Limpa o DOM entre os testes (remove o que foi renderizado)
	cleanup()

	// Reseta todos os spies e mocks do Vitest (`vi.fn`, `vi.spyOn`, etc.)
	// Garante que os testes sejam independentes e não tenham "lixo" de execuções anteriores
	vi.resetAllMocks()

	// Limpa a tabela da base de dados caso tenha ficado lixo
	// await clearDrizzleTodoTable();
})
