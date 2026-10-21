import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCog, 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  Building2, 
  Key, 
  UserPlus, 
  Search,
  CheckCircle2,
  Copy,
  Clock,
  ShieldAlert,
  Edit2,
  PowerOff,
  RefreshCw,
  Eye,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { allPermissions } from '../../mock/data';
import { User, PermissionKey, UserRole, UserStatus } from '../../types';

export const UsersView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    works, 
    addUser, 
    editUser, 
    toggleUserActive, 
    showToast,
    requestConfirmation,
    companyBranding
  } = useApp();

  const isAdmin = currentUser.role === 'ADM do sistema';

  // Navigation tab inside users view: 'list' | 'matrix'
  const [activeTab, setActiveTab] = useState<'list' | 'matrix'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User>(currentUser);
  const [activeGroupFilter, setActiveGroupFilter] = useState('all');

  // Modal: Add User
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Almoxarife');
  const [newUserWorkIds, setNewUserWorkIds] = useState<string[]>(works.map(w => w.id));
  const [createdProvisionalCreds, setCreatedProvisionalCreds] = useState<{
    login: string;
    provisionalPassword: string;
  } | null>(null);

  // Modal: Edit User
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('Almoxarife');
  const [editUserWorkIds, setEditUserWorkIds] = useState<string[]>([]);
  const [reissuedCreds, setReissuedCreds] = useState<{
    login: string;
    provisionalPassword: string;
  } | null>(null);

  const groups = Array.from(new Set(allPermissions.map((p) => p.group)));

  // Generate random safe provisional code: e.g. "A8K-29P-X7"
  const generateProvisionalCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = (len: number) => 
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment(3)}-${segment(3)}-${segment(2)}`;
  };

  const openAddUser = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserRole('Almoxarife');
    setNewUserWorkIds(works.length > 0 ? [works[0].id] : []);
    setCreatedProvisionalCreds(null);
    setIsAddUserModalOpen(true);
  };

  const handleGenerateProvisionalAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast({
        type: 'error',
        title: 'Dados obrigatórios',
        message: 'Preencha o nome completo e o e-mail/login do usuário.',
      });
      return;
    }

    // Default permissions according to selected role
    let initialPermissions: PermissionKey[] = [];
    if (newUserRole === 'ADM do sistema') {
      initialPermissions = allPermissions.map(p => p.key);
    } else if (newUserRole === 'Engenheiro') {
      initialPermissions = allPermissions
        .filter(p => !p.key.includes('materials.entry') && !p.key.includes('materials.exit'))
        .map(p => p.key);
    } else if (newUserRole === 'Almoxarife') {
      initialPermissions = allPermissions
        .filter(p => p.group === 'Materiais' || p.group === 'Ferramentas' || p.group === 'EPIs')
        .map(p => p.key);
    } else {
      initialPermissions = allPermissions
        .filter(p => p.group === 'Andamento' || p.group === 'Funcionários')
        .map(p => p.key);
    }

    const provisionalPass = generateProvisionalCode();

    const created = {
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      companyId: currentUser.companyId,
      workIds: newUserWorkIds,
      defaultWorkId: newUserWorkIds[0] || (works[0]?.id || ''),
      permissions: initialPermissions,
      isActive: true,
      status: 'Primeiro acesso pendente' as UserStatus,
      provisionalPassword: provisionalPass,
      requiresPasswordChange: true,
    };

    addUser(created);

    setCreatedProvisionalCreds({
      login: newUserEmail.trim().toLowerCase(),
      provisionalPassword: provisionalPass,
    });

    showToast({
      type: 'success',
      title: 'Acesso provisório gerado com sucesso',
      message: `Usuário ${newUserName} cadastrado com status "Primeiro acesso pendente".`,
    });
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserPhone(user.phone || '');
    setEditUserRole(user.role);
    setEditUserWorkIds([...user.workIds]);
    setReissuedCreds(null);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    editUser(editingUser.id, {
      name: editUserName.trim(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      workIds: editUserWorkIds,
    });

    showToast({
      type: 'success',
      title: 'Usuário atualizado',
      message: `Os dados de ${editUserName} foram salvos com sucesso.`,
    });
    setEditingUser(null);
  };

  const handleReissueProvisional = (userId: string, email: string) => {
    requestConfirmation({
      title: 'Gerar novo acesso provisório?',
      message: 'A senha atual será invalidada e uma nova senha temporária será criada para o usuário definir no primeiro acesso.',
      confirmLabel: 'Gerar nova senha',
      onConfirm: () => {
        const newCode = generateProvisionalCode();
        editUser(userId, {
          provisionalPassword: newCode,
          status: 'Primeiro acesso pendente',
          requiresPasswordChange: true,
        });
        setReissuedCreds({
          login: email,
          provisionalPassword: newCode,
        });
        showToast({
          type: 'info',
          title: 'Novo acesso gerado',
          message: 'Envie o código de acesso provisório ao colaborador.',
        });
      },
    });
  };

  const handleToggleActiveWithConfirm = (u: User) => {
    if (u.id === currentUser.id) {
      showToast({
        type: 'warning',
        title: 'Ação não permitida',
        message: 'Você não pode inativar seu próprio usuário administrador ativo.',
      });
      return;
    }

    if (u.isActive) {
      requestConfirmation({
        title: `Inativar acesso de ${u.name}?`,
        message: 'O usuário não conseguirá acessar o sistema. O histórico e registros de obras serão preservados.',
        confirmLabel: 'Inativar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => {
          toggleUserActive(u.id);
        },
      });
    } else {
      toggleUserActive(u.id);
    }
  };

  const handleTogglePermission = (key: PermissionKey) => {
    if (!isAdmin) {
      showToast({
        type: 'error',
        title: 'Ação restrita ao ADM',
        message: 'Somente o Administrador do Sistema pode alterar a matriz de permissões individuais.',
      });
      return;
    }

    const currentPerms = selectedUser.permissions;
    const isPresent = currentPerms.includes(key);

    const updatedPerms = isPresent
      ? currentPerms.filter((p) => p !== key)
      : [...currentPerms, key];

    const updatedUser = { ...selectedUser, permissions: updatedPerms };
    setSelectedUser(updatedUser);
    editUser(selectedUser.id, { permissions: updatedPerms });

    showToast({
      type: 'info',
      title: isPresent ? 'Permissão Removida' : 'Permissão Concedida',
      message: `${key} para ${selectedUser.name}`,
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredPermissions = allPermissions.filter((p) => {
    const matchesGroup = activeGroupFilter === 'all' || p.group === activeGroupFilter;
    const matchesSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.key.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'success',
      title: `${label} copiado!`,
      message: text,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--btn-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--btn-primary)'
              }}
            >
              <UserCog className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Usuários e Acessos</h1>
              <p className="text-xs text-slate-400">
                Gestão de colaboradores, acessos provisórios e matriz de permissões por obra
              </p>
            </div>
          </div>
        </div>

        {/* Action button: Adicionar usuário (Requirement 8) */}
        {isAdmin && (
          <button
            type="button"
            onClick={openAddUser}
            className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar usuário</span>
          </button>
        )}
      </div>

      {/* Tabs navigation: Lista de Usuários vs Matriz de Permissões */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'list'
              ? 'bg-[var(--btn-secondary)] text-[var(--title-color)] border border-[var(--border-color)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--title-color)]'
          }`}
        >
          Usuários da Empresa ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-[var(--btn-secondary)] text-[var(--title-color)] border border-[var(--border-color)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--title-color)]'
          }`}
        >
          Matriz de Permissões
        </button>
      </div>

      {/* ============================================================== */}
      {/* ABA 1: LISTA DE USUÁRIOS (TABELA E AÇÕES)                      */}
      {/* ============================================================== */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuário por nome ou e-mail..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os cargos</option>
                <option value="ADM do sistema">ADM do sistema</option>
                <option value="Engenheiro">Engenheiro</option>
                <option value="Mestre de Obras">Mestre de Obras</option>
                <option value="Encarregado">Encarregado</option>
                <option value="Almoxarife">Almoxarife</option>
                <option value="Estagiário">Estagiário</option>
              </select>
            </div>
          </div>

          {/* Users Table / Mobile Cards (Dual-Mode: Sem Rolagem Lateral) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
            {/* Desktop Table (md: e superior) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Cargo</th>
                    <th className="py-3 px-4">Login / E-mail</th>
                    <th className="py-3 px-4">Obras Autorizadas</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isLogged = currentUser.id === u.id;
                    const authorizedWorkNames = u.workIds
                      .map((id) => works.find((w) => w.id === id)?.name || id)
                      .filter(Boolean);

                    return (
                      <tr 
                        key={u.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          !u.isActive ? 'opacity-60 bg-slate-950/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{u.name}</span>
                            {isLogged && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          {u.phone && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">{u.phone}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {u.role}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-slate-300 max-w-[200px] truncate">
                          {authorizedWorkNames.length > 0
                            ? authorizedWorkNames.join(', ')
                            : 'Todas da empresa'}
                        </td>

                        <td className="py-3.5 px-4">
                          {!u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              ● Inativo
                            </span>
                          ) : u.status === 'Primeiro acesso pendente' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              Primeiro acesso pendente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ● Ativo
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ver detalhes / Matriz */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setActiveTab('matrix');
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                              title="Ver matriz de permissões"
                            >
                              Ver detalhes
                            </button>

                            {/* Editar (ADM only) */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                                title="Editar dados e cargo"
                              >
                                Editar
                              </button>
                            )}

                            {/* Inativar / Reativar (Requirement 9 & 15) */}
                            {isAdmin && !isLogged && (
                              <button
                                type="button"
                                onClick={() => handleToggleActiveWithConfirm(u)}
                                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                  u.isActive
                                    ? 'bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                }`}
                              >
                                {u.isActive ? 'Inativar' : 'Reativar'}
                              </button>
                            )}

                            {/* Gerar nova senha provisória (ADM only, NEVER 'Ver senha'!) */}
                            {isAdmin && u.isActive && (
                              <button
                                type="button"
                                onClick={() => handleReissueProvisional(u.id, u.email)}
                                className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Gerar nova senha provisória"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (md:hidden - Fim da rolagem lateral) */}
            <div className="block md:hidden p-3 space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Nenhum usuário encontrado com os filtros atuais.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isLogged = currentUser.id === u.id;
                  const authorizedWorkNames = u.workIds
                    .map((id) => works.find((w) => w.id === id)?.name || id)
                    .filter(Boolean);

                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        !u.isActive ? 'bg-slate-950/60 border-slate-800 opacity-60' : 'bg-slate-950/40 border-slate-800'
                      }`}
                    >
                      {/* Top Header: User Name, Badge "Você" e Status */}
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{u.name}</span>
                            {isLogged && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                            {u.role}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {!u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              ● Inativo
                            </span>
                          ) : u.status === 'Primeiro acesso pendente' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              Pendente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ● Ativo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User Info Details */}
                      <div className="py-2.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">Login / E-mail:</span>
                          <span className="font-mono text-[11px] text-slate-300 truncate">{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400">Telefone:</span>
                            <span className="text-slate-300 font-mono text-[11px]">{u.phone}</span>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] text-slate-400 shrink-0">Obras:</span>
                          <span className="text-[11px] text-slate-300 text-right truncate">
                            {authorizedWorkNames.length > 0 ? authorizedWorkNames.join(', ') : 'Todas da empresa'}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons (Sem Rolagem Lateral) */}
                      <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setActiveTab('matrix');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          Ver detalhes
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] text-xs font-medium transition-colors"
                          >
                            Editar
                          </button>
                        )}

                        {isAdmin && !isLogged && (
                          <button
                            type="button"
                            onClick={() => handleToggleActiveWithConfirm(u)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              u.isActive
                                ? 'bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            }`}
                          >
                            {u.isActive ? 'Inativar' : 'Reativar'}
                          </button>
                        )}

                        {isAdmin && u.isActive && (
                          <button
                            type="button"
                            onClick={() => handleReissueProvisional(u.id, u.email)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                            title="Gerar nova senha provisória"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Política de Privacidade & Segurança de Senhas:</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                As senhas pessoais definitivas pertencem exclusivamente a cada usuário e nunca são exibidas a ninguém, inclusive ao Administrador do Sistema. Quando necessário, o Administrador pode emitir um novo acesso provisório que obriga o usuário a redefinir sua senha pessoal no login.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: MATRIZ DE PERMISSÕES INDIVIDUAIS                        */}
      {/* ============================================================== */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: User selector list */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Selecione o Usuário ({users.length})
            </div>

            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = selectedUser.id === u.id;
                const isLogged = currentUser.id === u.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs truncate">{u.name}</span>
                        {isLogged && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-blue-400 font-semibold mt-0.5">{u.role}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{u.email}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800">
                        {u.permissions.length} ativas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Permissions Grid Checklist */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedUser.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Obras autorizadas:{' '}
                    {selectedUser.workIds.map((wid) => works.find((w) => w.id === wid)?.name || wid).join(', ') || 'Todas'}
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400">Total de Permissões: </span>
                  <strong className="text-blue-400 font-mono">
                    {selectedUser.permissions.length} de {allPermissions.length}
                  </strong>
                </div>
              </div>

              {/* Group filter tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveGroupFilter('all')}
                  className="px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  style={
                    activeGroupFilter === 'all'
                      ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                      : { backgroundColor: 'var(--btn-secondary)', color: 'var(--text-secondary)' }
                  }
                >
                  Todos ({allPermissions.length})
                </button>
                {groups.map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setActiveGroupFilter(grp)}
                    className="px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    style={
                      activeGroupFilter === grp
                        ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                        : { backgroundColor: 'var(--btn-secondary)', color: 'var(--text-secondary)' }
                    }
                  >
                    {grp}
                  </button>
                ))}
              </div>

              {/* Matrix List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredPermissions.map((perm) => {
                  const hasPerm = selectedUser.permissions.includes(perm.key);

                  return (
                    <div
                      key={perm.key}
                      onClick={() => isAdmin && handleTogglePermission(perm.key)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isAdmin ? 'cursor-pointer' : 'cursor-default'
                      } ${
                        hasPerm
                          ? 'bg-slate-800/80 border-blue-500/30 text-white'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <span>{perm.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{perm.key}]</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Módulo: {perm.group}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          hasPerm
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-600'
                        }`}>
                          {hasPerm ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADICIONAR USUÁRIO (Requirement 10)                      */}
      {/* ============================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-base font-bold text-white">Adicionar usuário</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If provisional password generated, show copy card */}
            {createdProvisionalCreds ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-sm">Usuário e Acesso Provisório Gerados!</strong>
                    <span>
                      Entregue as credenciais provisórias abaixo ao funcionário. No primeiro acesso, ele será obrigado a criar uma senha pessoal definitiva.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1 font-sans">Login / E-mail:</span>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="text-white font-bold">{createdProvisionalCreds.login}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(createdProvisionalCreds.login, 'Login')}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copiar login"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1 font-sans">Senha Provisória (Temporária):</span>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/40 text-blue-300">
                      <span className="text-base font-extrabold tracking-wider">{createdProvisionalCreds.provisionalPassword}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(createdProvisionalCreds.provisionalPassword, 'Senha provisória')}
                        className="px-2.5 py-1 rounded font-sans text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar senha</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] italic">
                  Status: <strong style={{ color: 'var(--accent-color)' }}>Primeiro acesso pendente</strong>. Esta senha deixará de funcionar assim que a senha pessoal for criada.
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateProvisionalAccess} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail / Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="funcionario@empresa.com.br"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telefone (opcional)
                    </label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cargo / Função *
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Almoxarife">Almoxarife</option>
                      <option value="Encarregado">Encarregado</option>
                      <option value="Mestre de Obras">Mestre de Obras</option>
                      <option value="Estagiário">Estagiário</option>
                      <option value="Engenheiro">Engenheiro</option>
                      <option value="ADM do sistema">ADM do sistema</option>
                    </select>
                  </div>
                </div>

                {/* Obras autorizadas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Obras às quais terá acesso:
                  </label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {works.map((w) => {
                      const isChecked = newUserWorkIds.includes(w.id);
                      return (
                        <label
                          key={w.id}
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewUserWorkIds(prev => [...prev, w.id]);
                              } else {
                                setNewUserWorkIds(prev => prev.filter(id => id !== w.id));
                              }
                            }}
                            className="rounded border-slate-700 text-blue-600 focus:ring-0"
                          />
                          <span>{w.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    <Key className="w-4 h-4" />
                    <span>Gerar acesso provisório</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDITAR USUÁRIO                                          */}
      {/* ============================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-base font-bold text-white">Editar usuário</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reissuedCreds ? (
              <div className="space-y-4 py-2">
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                  <strong className="block text-sm">Novo Acesso Provisório Emitido</strong>
                  <span>O colaborador precisará definir uma nova senha pessoal no próximo login.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Login:</span>
                    <strong className="text-white">{reissuedCreds.login}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Nova Senha Provisória:</span>
                    <strong className="text-base text-blue-400">{reissuedCreds.provisionalPassword}</strong>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl font-bold text-xs"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveEditUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Login / E-mail (somente leitura)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={editingUser.email}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={editUserPhone}
                      onChange={(e) => setEditUserPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cargo / Perfil
                    </label>
                    <select
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Almoxarife">Almoxarife</option>
                      <option value="Encarregado">Encarregado</option>
                      <option value="Mestre de Obras">Mestre de Obras</option>
                      <option value="Estagiário">Estagiário</option>
                      <option value="Engenheiro">Engenheiro</option>
                      <option value="ADM do sistema">ADM do sistema</option>
                    </select>
                  </div>
                </div>

                {/* Obras autorizadas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Obras com acesso autorizado:
                  </label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {works.map((w) => {
                      const isChecked = editUserWorkIds.includes(w.id);
                      return (
                        <label
                          key={w.id}
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditUserWorkIds(prev => [...prev, w.id]);
                              } else {
                                setEditUserWorkIds(prev => prev.filter(id => id !== w.id));
                              }
                            }}
                            className="rounded border-slate-700 text-blue-600 focus:ring-0"
                          />
                          <span>{w.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Esqueceu ou precisa redefinir?</span>
                    <span className="text-[10px] text-slate-400">Emite novo acesso provisório</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReissueProvisional(editingUser.id, editingUser.email)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 font-bold transition-colors cursor-pointer"
                  >
                    Gerar nova senha provisória
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
