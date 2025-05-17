import { Test, TestingModule } from '@nestjs/testing';
import { LibroBibliotecaService } from './libro-biblioteca.service';

describe('LibroBibliotecaService', () => {
  let service: LibroBibliotecaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibroBibliotecaService],
    }).compile();

    service = module.get<LibroBibliotecaService>(LibroBibliotecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
