import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom"; //Single-Page Application
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api";
import Dropzone from "../../components/Dropzone";
import logo from "../../assets/logo.svg";
import "./styles.css";

interface Item {
  id: number;
  title: string;
  image_url: string;
}
const CreateLocation: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [selectedMapPosition, setSelectedMapPosition] = useState<
    [number, number]
  >([0, 0]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    city: "",
    uf: "",
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory(); //useHistory - navegar entre rotas sem ação do usuário

  useEffect(() => {
    api.get("items").then((response: any) => {
      setItems(response.data);
    });
  }, []);

  const handleMapClick = useCallback((event: LeafletMouseEvent): void => {
    setSelectedMapPosition([event.latlng.lat, event.latlng.lng]);
  }, []); // array vazio quer dizer que a função (useCallback) vai ser criada junto da criação do componente principal (CreateLocation) e nunca mais será recriada

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const handleSelectItem = useCallback(
    (id: number) => {
      const alreadySelected = selectedItems.findIndex((item) => item === id); //findIndex retorna um valor >= 0 se encontrar o valor, se não encontrar, retorna -1

      //desfazer uma seleção do item
      if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter((item) => item !== id);
        setSelectedItems(filteredItems);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    },
    [selectedItems]
  );

  //envio do formulário
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault(); //inibe o recarregamento da página ao enviar o formulário

      const { city, email, name, uf, whatsapp } = formData;
      const [latitude, longitude] = selectedMapPosition;
      const items = selectedItems;

      const data = new FormData();

      data.append("name", name);
      data.append("email", email);
      data.append("whatsapp", whatsapp);
      data.append("uf", uf);
      data.append("city", city);
      data.append("latitude", String(latitude));
      data.append("longitude", String(longitude));
      data.append("items", items.join(","));
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await api.post("locations", data);

      alert("Estabelecimento cadastrado com sucesso");
      history.push("/");
    },
    [formData, selectedItems, selectedMapPosition, history, selectedFile]
  );

  return (
    <div id="page-create-location">
      <div className="content">
        <header>
          <img src={logo} alt="Coleta Seletiva" />
          <Link to="/">
            <FiArrowLeft />
            Volta para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do <br /> local de coleta
          </h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <Dropzone onFileUploaded={setSelectedFile} />

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Marque o endereço no mapa</span>
            </legend>
            <Map
              center={[-29.950121197917433, -51.08301615719939]}
              zoom={14}
              onClick={handleMapClick}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedMapPosition} />
            </Map>
            <div className="field-group">
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="uf">Estado</label>
                <input
                  type="text"
                  name="uf"
                  id="uf"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Itens coletados</h2>
              <span>Você pode marcar um ou mais itens</span>
            </legend>
            <ul className="items-grid">
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  //verifica se o id do item atual está no array do estado, se estiver é porquê está selecionado = aplica classe css
                  className={selectedItems.includes(item.id) ? "selected" : ""}
                >
                  <img src={item.image_url} alt={item.title} />
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar local de coleta</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocation;
