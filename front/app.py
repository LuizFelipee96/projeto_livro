import streamlit as st
import requests

def main():
    st.title("Resumo de livros")
    livro = st.file_uploader("Escolha o livro", type=["pdf", "txt"])

    st.sidebar.title("Tamanho do resumo")
    tamanho_resumo = st.sidebar.slider("Número de páginas", 1, 100, 1)

    btn_processar = st.button("Iniciar processamento")

    if btn_processar and livro is not None:
        # Salvar o arquivo temporariamente
        with open(livro.name, "wb") as f:
            f.write(livro.getbuffer())

        # Enviar o arquivo para o servidor
        with open(livro.name, "rb") as f:
            response = requests.post(
                "http://localhost:3000/processarLivro",
                files={"livro": f},
                data={"tamanhoResumo": tamanho_resumo}
            )

        if response.status_code == 200:
            st.write(response.text)
        else:
            st.error("Erro ao processar o livro")
    elif livro is None and btn_processar:
        st.error("Selecione um livro")

if __name__ == "__main__":
    main()
